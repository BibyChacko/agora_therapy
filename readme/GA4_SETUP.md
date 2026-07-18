# GA4 Setup

This project sends GA4 events only after analytics consent is accepted.

## Recommended Streams

Create separate GA4 web streams for:

- `MindGood Web - Production`
- `MindGood Web - Staging`
- `MindGood Web - Development`

Use the stream measurement IDs in the matching environment files:

- `.env.prod` for production
- `.env.local` for local development

## Recommended Key Events

Mark these events as key events in GA4:

- `generate_lead`
- `sign_up`
- `login`
- `begin_checkout`
- `purchase`

## Implemented Events

This codebase currently tracks:

- `view_item`
  Therapist booking page viewed
- `select_item`
  Therapist selected from a listing card
- `begin_checkout`
  User moved from date/time selection into payment flow
- `add_payment_info`
  User submitted Stripe payment details
- `purchase`
  Booking payment completed
- `generate_lead`
  Contact form submitted
- `login`
  Login completed
- `sign_up`
  Registration completed
- `exception`
  Important client-side analytics-safe failures

## Suggested Custom Dimensions

If you want richer reporting in GA4, register these event-scoped custom dimensions:

- `user_role`
- `therapist_id`
- `session_type`
- `appointment_id`
- `form_name`
- `preferred_language`

## Official References

- GA4 setup: https://support.google.com/analytics/answer/9304153
- GA4 key events: https://support.google.com/analytics/answer/9355848
- GA4 recommended events: https://developers.google.com/analytics/devguides/collection/ga4/reference/events

