system.admin@dialyzeease.org
example.com

Yohan Hirimuthugoda
yohan.dh@gmail.com
users.id = 1006
Above should map to appointments table
appointments.patient_id = users.id
If appointments table has aboove condition match records
Then map with schedule_sessions table
appointments.schedule_session_id = schedule_sessions.id

Shall we bring table data from DB?
appointments table
schedule_sessions table
sessions table
beds table
centers table
Analyze schema from: dialyzeease-scripts\dialyzeease_db_schema_v1.8.sql

I have already started the backend server at localhost:5000 using npm run dev command. Source code at dialyzeease-api.
I have already started the frontend server at localhost:80 using npm run dev command. Source code at dialyzeease-web.
Kindly run embedded browser to debug errors under the same ports or runtime. Don't stop and start a new backend instance or frontend instance absolutely necessary. It will use my action items, and it will be waist.

Consistent Toast notification system:
Show toast messages at the bottom right corner.
- Support 4 types of messages: `success`, `error`, `warning`, and `info`.
- Use the following styling:
  - `success`: Light green background (`bg-green-100`) with green text (`text-green-800`)
  - `error`: Light red background (`bg-red-100`) with red text (`text-red-800`)
  - `warning`: Light orange background (`bg-yellow-100`) with orange text (`text-yellow-800`)
  - `info`: Light blue background (`bg-blue-100`) with blue text (`text-blue-800`)
- Each toast should:
  - Be dismissible (close button)
  - Auto-dismiss after 5 seconds
  - Use smooth slide/fade animation when appearing and disappearing
