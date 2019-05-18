### Brief API doc

+ Endpoints:
    + Pre-endpoint: **api = "https://photohub-e7e04.firebaseapp.com/api/v1"**

    + Sign up:
         *POST  api/signup*

    + Login:
         *POST  api/login*

    + Update profile:
         *PUT   api/users/<user_name>*
    
    + Get all tags:
         *GET   api/tags*
         
    + Create tags:
         *POST api/tags*
    
    + Get all images:
         *GET   api/images*
         + With pagination:
         
            *GET   api/images/first*
         
            *GET   api/images/after*
    
    + Get images by tag:
         *POST   api/images/search*
         + With pagination:
                  
             *GET   api/images/search/first*
                  
             *GET   api/images/search/after*

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

    + **Get Tags**
    
            - GET  api/tags
            - Request payload: None
                - Response:
                + OK:
                    - Status Code: 200
                    - Payload:
                        ```
                        {
                            "status": true,
                            "tags": [list of tag] 
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
    + **Get All Image**
    
            - GET  api/images
            - Header: Authorization: Bearer TOKEN
            - Request payload: None
                - Response:
                + OK:
                    - Status Code: 200
                    - Payload:
                        ```
                        {
                            list of image
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
                        
    + **Get All Image With Pagination**
    
         - The same method with GET ALL IMAGE
         - Only different on end-point:
          
             *GET  api/images/first* for first loading.
             
             *GET  api/images/after* for each after loading.
                       
    + **Get Image By Tag**

        - POST  api/images
        - Header: Authorization: Bearer TOKEN
        - Request payload:
            ```
            {
                tags: ["field_1", "field_2", "field_3", ...]
            }
            
            where tags is list of tags that user choose for searching images.
            "field_1", "field_2" is the name of tags that user choose, and value is true.

            Notice that every field that value equal {"", null, false} will be ignore for search.
            For example:
            {
                tags: ["2", "younger", false, ""]
            }
            equals to
            {
                tags: tags: ["1", "younger"]
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

    + **Get Image By Tag With Pagination**
    
         - The same method with GET IMAGE BY TAG
         - Only different on end-point:
          
             *POST  api/images/search/first* for first loading.
             
             *POST  api/images/search/after* for each after loading, and this end-point don't need to have request paylod.   