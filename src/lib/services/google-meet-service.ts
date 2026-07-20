import { FieldValue } from "firebase-admin/firestore";
import { google } from "googleapis";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { appConfig, googleConfig } from "@/lib/config";

const GOOGLE_MEET_DOC = "googleMeet";
const GOOGLE_OAUTH_STATE_COLLECTION = "googleMeetOAuthStates";
const OAUTH_STATE_TTL_MS = 15 * 60 * 1000;
const REQUIRED_MEET_SCOPE =
  "https://www.googleapis.com/auth/meetings.space.created";

interface GoogleMeetIntegrationData {
  accessToken?: string;
  refreshToken?: string;
  expiryDate?: number;
  scope?: string;
  tokenType?: string;
  hostEmail?: string;
  connectedAt?: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue;
  updatedAt?: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue;
}

interface CreateMeetingSpaceResult {
  meetingUri: string;
  meetingCode: string;
  spaceName: string;
}

interface GoogleMeetConnectionStatus {
  connected: boolean;
  hostEmail: string | null;
  updatedAt: string | null;
  hasRequiredScope: boolean;
  scope: string | null;
  statusMessage: string | null;
}

class GoogleMeetService {
  private hasRequiredScope(scope: string | undefined) {
    if (!scope) {
      return false;
    }

    return scope.split(/\s+/).includes(REQUIRED_MEET_SCOPE);
  }

  private createOAuthClient() {
    if (!googleConfig.clientId || !googleConfig.clientSecret || !googleConfig.redirectUri) {
      console.error("Google Meet OAuth config is incomplete:", {
        hasClientId: Boolean(googleConfig.clientId),
        hasClientSecret: Boolean(googleConfig.clientSecret),
        redirectUri: googleConfig.redirectUri || null,
      });
      throw new Error(
        "Google Meet OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI."
      );
    }

    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirectUri
    );
  }

  private getIntegrationRef() {
    return getAdminFirestore().collection("platform").doc(GOOGLE_MEET_DOC);
  }

  private getOAuthStateRef(state: string) {
    return getAdminFirestore()
      .collection(GOOGLE_OAUTH_STATE_COLLECTION)
      .doc(state);
  }

  async createAuthorizationState(adminUserId: string) {
    const state = crypto.randomUUID();

    await this.getOAuthStateRef(state).set({
      adminUserId,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + OAUTH_STATE_TTL_MS),
    });

    return state;
  }

  async consumeAuthorizationState(state: string) {
    const ref = this.getOAuthStateRef(state);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      throw new Error("Google Meet authorization state is invalid or has expired.");
    }

    const data = snapshot.data() as {
      adminUserId?: string;
      expiresAt?: FirebaseFirestore.Timestamp;
    };

    await ref.delete();

    const expiresAt = data.expiresAt?.toDate?.();
    if (!data.adminUserId || !expiresAt || expiresAt.getTime() < Date.now()) {
      throw new Error("Google Meet authorization state is invalid or has expired.");
    }

    return data.adminUserId;
  }

  async getAuthorizationUrl(adminUserId: string) {
    const oauth2Client = this.createOAuthClient();
    const state = await this.createAuthorizationState(adminUserId);
    console.log("Generating Google Meet authorization URL:", {
      adminUserId,
      redirectUri: googleConfig.redirectUri,
      hasClientId: Boolean(googleConfig.clientId),
    });

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: true,
      scope: [
        REQUIRED_MEET_SCOPE,
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      state,
    });
  }

  async completeAuthorization(code: string, state: string) {
    console.log("Completing Google Meet OAuth authorization", {
      state,
      redirectUri: googleConfig.redirectUri,
      codeLength: code.length,
    });
    await this.consumeAuthorizationState(state);

    const oauth2Client = this.createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const profile = await oauth2.userinfo.get();

    const existingSnapshot = await this.getIntegrationRef().get();
    const existingData = existingSnapshot.data() as GoogleMeetIntegrationData | undefined;
    const refreshToken = tokens.refresh_token || existingData?.refreshToken;

    if (!refreshToken) {
      console.error("Google Meet OAuth completed without refresh token", {
        hasAccessToken: Boolean(tokens.access_token),
        scope: tokens.scope || null,
        hostEmail: profile.data.email || null,
      });
      throw new Error(
        "Google did not return a refresh token. Reconnect the Google Meet host account with consent."
      );
    }

    console.log("Google Meet OAuth tokens received successfully", {
      hostEmail: profile.data.email || null,
      hasAccessToken: Boolean(tokens.access_token),
      hasRefreshToken: Boolean(refreshToken),
      expiryDate: tokens.expiry_date || null,
      scope: tokens.scope || null,
      hasRequiredScope: this.hasRequiredScope(tokens.scope),
    });

    await this.getIntegrationRef().set(
      {
        accessToken: tokens.access_token || existingData?.accessToken || "",
        refreshToken,
        expiryDate: tokens.expiry_date || existingData?.expiryDate || null,
        scope: tokens.scope || existingData?.scope || "",
        tokenType: tokens.token_type || existingData?.tokenType || "",
        hostEmail: profile.data.email || existingData?.hostEmail || "",
        connectedAt: existingData?.connectedAt || FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    if (!this.hasRequiredScope(tokens.scope || existingData?.scope)) {
      throw new Error(
        "Google Meet connected without the required meeting creation permission. Please reconnect and approve the requested access."
      );
    }
  }

  async getConnectionStatus(): Promise<GoogleMeetConnectionStatus> {
    const snapshot = await this.getIntegrationRef().get();
    if (!snapshot.exists) {
      console.warn("Google Meet connection status requested but integration doc does not exist.");
      return {
        connected: false,
        hostEmail: null,
        updatedAt: null,
        hasRequiredScope: false,
        scope: null,
        statusMessage: "Google Meet host account is not connected.",
      };
    }

    const data = snapshot.data() as GoogleMeetIntegrationData;
    const hasRequiredScope = this.hasRequiredScope(data.scope);
    const status = {
      connected: Boolean(data.refreshToken) && hasRequiredScope,
      hostEmail: data.hostEmail || null,
      updatedAt:
        data.updatedAt &&
        typeof data.updatedAt === "object" &&
        "toDate" in data.updatedAt
          ? data.updatedAt.toDate().toISOString()
          : null,
      hasRequiredScope,
      scope: data.scope || null,
      statusMessage: !data.refreshToken
        ? "Google Meet is missing a refresh token. Reconnect the host account."
        : !hasRequiredScope
        ? "Google Meet is connected, but the required meeting creation permission is missing. Reconnect and approve the requested access."
        : "Google Meet is connected and ready.",
    };

    console.log("Google Meet connection status loaded", {
      ...status,
      hasAccessToken: Boolean(data.accessToken),
      hasRefreshToken: Boolean(data.refreshToken),
      expiryDate: data.expiryDate || null,
    });

    return status;
  }

  private async getAuthorizedAccessToken() {
    const snapshot = await this.getIntegrationRef().get();
    if (!snapshot.exists) {
      console.error("Google Meet access token requested before integration was connected.");
      throw new Error("Google Meet is not connected yet.");
    }

    const data = snapshot.data() as GoogleMeetIntegrationData;
    if (!data.refreshToken) {
      console.error("Google Meet integration doc is missing refresh token.", {
        hostEmail: data.hostEmail || null,
        hasAccessToken: Boolean(data.accessToken),
      });
      throw new Error("Google Meet is missing a refresh token. Reconnect the host account.");
    }

    if (!this.hasRequiredScope(data.scope)) {
      console.error("Google Meet integration doc is missing the required scope.", {
        hostEmail: data.hostEmail || null,
        scope: data.scope || null,
        requiredScope: REQUIRED_MEET_SCOPE,
      });
      throw new Error(
        "Google Meet is connected without the required meeting creation permission. Reconnect the host account and approve the requested access."
      );
    }

    console.log("Refreshing Google Meet access token", {
      hostEmail: data.hostEmail || null,
      hasCachedAccessToken: Boolean(data.accessToken),
      expiryDate: data.expiryDate || null,
      scope: data.scope || null,
    });

    const oauth2Client = this.createOAuthClient();
    oauth2Client.setCredentials({
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      expiry_date: data.expiryDate,
      scope: data.scope,
      token_type: data.tokenType,
    });

    const tokenResponse = await oauth2Client.getAccessToken();
    const accessToken = tokenResponse.token;

    if (!accessToken) {
      console.error("Google Meet access token refresh returned no token.", {
        hostEmail: data.hostEmail || null,
      });
      throw new Error("Failed to refresh the Google Meet access token.");
    }

    const credentials = oauth2Client.credentials;
    console.log("Google Meet access token refreshed successfully", {
      hostEmail: data.hostEmail || null,
      expiryDate: credentials.expiry_date || data.expiryDate || null,
    });
    await this.getIntegrationRef().set(
      {
        accessToken,
        expiryDate: credentials.expiry_date || data.expiryDate || null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return accessToken;
  }

  async createMeetingSpace(): Promise<CreateMeetingSpaceResult> {
    console.log("Starting Google Meet space creation");
    const accessToken = await this.getAuthorizedAccessToken();

    const response = await fetch("https://meet.googleapis.com/v2/spaces", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        config: {
          accessType: "OPEN",
          entryPointAccess: "ALL",
        },
      }),
    });

    const responseData = await response.json().catch(() => null);
    console.log("Google Meet create space response received", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseData,
    });

    if (!response.ok) {
      const apiMessage =
        (responseData as { error?: { message?: string } } | null)?.error?.message ||
        "Failed to create Google Meet space";
      throw new Error(apiMessage);
    }

    const meetingSpace = responseData as {
      name?: string;
      meetingUri?: string;
      meetingCode?: string;
    };

    if (!meetingSpace.name || !meetingSpace.meetingUri || !meetingSpace.meetingCode) {
      console.error("Google Meet returned incomplete space data", meetingSpace);
      throw new Error("Google Meet returned an incomplete meeting space response.");
    }

    console.log("Google Meet space created successfully", {
      spaceName: meetingSpace.name,
      meetingCode: meetingSpace.meetingCode,
      meetingUri: meetingSpace.meetingUri,
    });

    return {
      spaceName: meetingSpace.name,
      meetingUri: meetingSpace.meetingUri,
      meetingCode: meetingSpace.meetingCode,
    };
  }

  getSessionLandingUrl(appointmentId: string) {
    return `${appConfig.url}/session/${appointmentId}`;
  }
}

export const googleMeetService = new GoogleMeetService();
