### Authentication

| Part                   | Purpose                           | Where it Happens              |
| ---------------------- | --------------------------------- | ----------------------------- |
| Credential Collection  | Get user identity info            | Frontend (form, OAuth)        |
| Authentication         | Verify credentials                | Backend or Auth provider      |
| Token/Session Issuance | Maintain identity across requests | Backend                       |
| Storage                | Store token/session securely      | Frontend (cookie, storage)    |
| Authenticated Requests | Perform actions as that user      | Backend (middleware, handler) |

+ how to privatize access to pages in nextjs?
+ make sure all page are responsive
+ Check out BFF architecture (Back end for Front end)



