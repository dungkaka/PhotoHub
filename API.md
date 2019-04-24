### Brief API doc

+ Endpoints:
    + Pre-endpoint: **api = "https://photohub-e7e04.firebaseapp.com/"**

    + Sign up:
         *POST  api/signup*

    + Login:
         *POST  api/login*

    + Update profile:
         *PUT   api/users/<user_name>*
    
    + Get all images:
         *GET   api/images*
    
    + Get images by tag:
         *POST   api/images*

    + Get collections (USER):
         *GET   api/collections*

    + Get collection by id:
         *GET   api/collections/<collection_id>*
    
    + Create collection:
         *POST  api/collections/<collection_id>*

    + Update collection:
         *PUT   api/collections/<collection_id>*

    + Like image:
         *PUT   api/images/<image_id>*

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

    + **Get Image By Tag**

        - POST  api/images
        - Header: Authorization: Bearer TOKEN
        - Request payload:
            ```
            {
                tags: {
                    "field_1": string,
                    "field_2": string,
                    ...
                }
            }

            Notice that every field that value equal "", null will be ignore for search.
            For example:
            {
                tags: {
                    "accessories": "ring",
                    "number: 2,
                    "age": "",
                    "gender": null

                }
            }
            equals to
            {
                tags: {
                    "accessories": "ring",
                    "number: 2
                }
            }

            You can test 2 examples above for same result

            ```      

        - Responses:
            + OK:
                - Status Code: 200
                - Payload:
                    ```
                    {
                        images_detail
                    }
                    ```

            + Bad request (Invalid Message, ...):
                - Status Code: 400
                - Payload:
                    ```
                    {
                        "status": false,
                        "code": int,
                        "message": "string"
                    }
                    ```
            