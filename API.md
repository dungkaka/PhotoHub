### Brief API doc

+ Endpoints:

    + Sign up:
        + POST  api/signup

    + Login:
        + POST  api/login

    + Update profile:
        + PUT   api/users/<user_name>
    
    + Get all images:
        + GET   api/images
    
    + Get images by tag:
        + POST   api/images

    + Get collections (USER):
        + GET   api/collections

    + Get collection by id:
        + GET   api/collections/<collection_id>
    
    + Create collection:
        + POST  api/collections/<collection_id>

    + Update collection:
        + PUT   api/collections/<collection_id>

    + Like image:
        + PUT   api/images/<image_id>

+ Content-Type: application/json

+ Authenication: Bear-Token

+ Detail for endpoint:

    + **Signup**:

        - POST api/signup
        - Request Payload:
            ```
            {
                "username": "string", // required
                "pasword": "string",  // required
                "email: "string",     // required
                "age": "string",
                "gender: "string,
            }
            ```

        - Responses:
            + OK:
                - Status Code: 200
                - Payload:
                    ```
                    {
                        "status": true,
                        "user": {
                            "user_id": "string",
                            "username": "string",
                            "email": "string",
                            "age": "string",
                            "gender": "string",
                            "password": empty
                        }
                    }
                    ```  

            + Bad request (Username is used already, ...): 
                - Status Code: 400
                - Payload:
                    ```
                    {
                        "status": false,
                        "code": int,
                        "message": "string",
                    }
                    ```

    + **Login**:

        - POST  api/login
        - Request payload:
            ```
            {
                "username": "string", //required
                "password": "string", //required
            }
            ```      

        - Responses:
            + OK:
                - Status Code: 200
                - Payload:
                    ```
                    {
                        "status": true,
                        "access_token": "string",
                        "user": {
                            "user_id": "string",
                            "username": "string",
                            "email": "string",
                            "gender": "string",
                            "age": "string",
                        }
                    }
                    ```

            + Bad request (Username/Password is wrong, ...):
                - Status Code: 400
                - Payload:
                    ```
                    {
                        "status": false,
                        "code": int,
                        "message": "string"
                    }
                    ```

            