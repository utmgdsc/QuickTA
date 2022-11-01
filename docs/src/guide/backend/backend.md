# Backend
---

## Models


## Endpoints


### <p style="color:green;">Chatlog Endpoints</p>
---
### getAgentResponse
---
Retrieves a chatlog from the user, posts it and also returns a response from the corresponding model assigned to the course.

#### <p style="color:green;">Request URL</p>
```
POST: /api/chatlog
```

**Curl**
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/api/chatlog' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRFToken: TldzPe8AZ3LClcLapFo2FmLsBCgZxfCTCvzFW1zbkDPAXYpMcMmokgzkHz4JMrAt' \
  -d '{
  "conversation_id": "1",
  "chatlog": "string"
}'
```

#### <p style="color:green;">Request Body</p>

- conversation_id: string
- chatlog: string

#### <p style="color:green;">Response Body</p>

#### <p style="color:green;">Code 201: CREATED</p>
```json
{
  "agent": {
    "conversation_id": "1",
    "chatlog_id": "2f05c8ea-be1a-4ae9-992f-296e98659654",
    "is_user": false,
    "chatlog": "hi",
    "status": "C"
  },
  "user": {
    "conversation_id": "1",
    "chatlog_id": "5561950d-a5d1-4845-86f1-103a8e278f21",
    "is_user": true,
    "chatlog": "string",
    "status": "C"
  }
}
```
#### <p style="color:red;">Code 401: UNAUTHORIZED</p>
```json
{
  "msg": "Chatlog details missing fields: Chatlog message."
}
```

### getAllResponses
---
Retrieves all chatlog from all users.

#### <p style="color:green;">Request URL</p>
```
GET: /api/chatlog/all
```

**Curl**
```bash
curl -X 'GET' \
  'http://127.0.0.1:8000/api/chatlog/all' \
  -H 'accept: application/json' \
  -H 'X-CSRFToken: ILsNt3iUxP2sGOSPM1HcmtE8pu2SWv7VrVOTAQJvSp6qiAwrz8Fy1ns0vrQCbH5v'
```

#### <p style="color:green;">Response Body</p>
#### <p style="color:green;">Code 200: OK</p>
``` json
  {
    "conversation_id": "4a832a81-576c-43aa-842f-304a94f274b3",
    "chatlog": "Hello! Testing out this functionality."
  },
  {
    "conversation_id": "4a832a81-576c-43aa-842f-304a94f274b3",
    "chatlog": "hi"
  },
  {
    "conversation_id": "4a832a81-576c-43aa-842f-304a94f274b3",
    "chatlog": "How is your day?"
  },
  {
    "conversation_id": "4a832a81-576c-43aa-842f-304a94f274b3",
    "chatlog": "hi"
  },
  {
    "conversation_id": "4a832a81-576c-43aa-842f-304a94f274b3",
    "chatlog": "Nice seeing you too!"
  },
  {
    "conversation_id": "4a832a81-576c-43aa-842f-304a94f274b3",
    "chatlog": "hi"
  },
```