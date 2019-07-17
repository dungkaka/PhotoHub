### Brief API doc

- Endpoints:

  - Pre-endpoint: **api = "https://photohub-e7e04.firebaseapp.com/api/v1"**

  - Sign up:
    _POST api/signup_

  - Login:
    _POST api/login_

  - Update profile:
    _PUT api/users/<user_name>_

  - Get all tags:
    _GET api/tags_
  - Create tags:
    _POST api/tags_

  - Get all images:
    _GET api/images_

  - Get image pagination: 
    _GET api/images/pagination_

  - Get images by tag:
    _POST api/images/search_

  - Get images by tag with pagination:
    _POST api/images/search/pagination_
       
  - Like image:
    _POST api/images/<:image_id>/likes_
    
  - Unlike image:
    _DELETE api/images/<:image_id>/likes_
    
  - Create collection:
    _POST api/collections/creates_  
  
  - Add Image to Collection:
    _POST api/collections/<:collectionId>/add-image_
    
  - Delete Image From Collection:
    _DELETE api/collections/<:collectionId>/delete-image_
  
  - Get collections of a user:
    _GET api/collections_

  - Get collection by id:
    _GET api/collections/<:collection_id>_

  - Update collection:
    _PUT api/collections/<:collection_id>_


- Content-Type: application/json

- Authenication: Bear-Token

- Detail for endpoint:

  - **Signup**:

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

      - OK:

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

      - Bad request (Username is used already, ...):
        - Status Code: 400
        - Payload:
          ```
          {
              "status": false,
              "code": int,
              "message": "string",
          }
          ```

  - **Login**:

    - POST api/login
    - Request payload:

      ```
      {
          "username": "string", //required
          "password": "string", //required
      }
      ```

    - Responses:

      - OK:

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

      - Bad request (Username/Password is wrong, ...):
        - Status Code: 400
        - Payload:
          ```
          {
              "status": false,
              "code": int,
              "message": "string"
          }
          ```

  - **Get Tags**

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

  - **Get All Image**

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

  - **Get Image Pagination**
    
    - GET api/images/pagination
    - Query Params:
        + after=<:image_id> with image_id is the id of the image which client want to get list of image after.
          Example: api/images/pagination?after=sfKAikek2312
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
                      
  - **Get Image By Tag**

    - POST api/images
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

      - OK:

        - Status Code: 200
        - Payload:
          ```
          {
              images_detail
          }
          ```

      - Bad request (Invalid Message, ...):
        - Status Code: 400
        - Payload:
          ```
          {
              "status": false,
              "code": int,
              "message": "string"
          }
          ```

  - **Get Image By Tag With Pagination**
    
    - POST api/images/search/pagination
    - Query Params:
        + after=<:image_id> with image_id is the id of the image which client want to get list of image after.
          Example: api/images/pagination?after=sfKAikek2312  
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

      - OK:

        - Status Code: 200
        - Payload:
          ```
          {
              images_detail
          }
          ```

      - Bad request (Invalid Message, ...):
        - Status Code: 400
        - Payload:
          ```
          {
              "status": false,
              "code": int,
              "message": "string"
          }
          ```
  - **Like image**

    - POST api/images/<:image_id>/likes
    - Header: Authorization: Bearer TOKEN
    - Param: <:image_id>, that is id of image which user want to like.
    - Request payload: None
    - Response:
        + OK:
            - Status Code: 200
            - Payload:
                ```
                {
                    message: "Completed like image !"
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
  - **Unlike image**
  
      - DELETE api/images/<:image_id>/likes
      - Header: Authorization: Bearer TOKEN
      - Param: <:image_id>, that is id of image which user want to like.
      - Request payload: None
      - Response:
          + OK:
              - Status Code: 200
              - Payload:
                  ```
                  {
                      message: "Completed unlike image !"
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
  
  - **Create Collection**
    
    - POST api/collections/creates
    - Header: Authorization: Bearer TOKEN
    - Request payload:
        ```
            {
                name: string,
            }
            
            where field name is name of Collection.
        ```
    - Response:
        + OK:
            - Status Code: 200
            - Payload:
                ```
                {
                    status: true,
                    collection: {
                        collection_field,
                    }
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
                
  - **Add Image to Collection**
      
      - POST api/collections/<:collectionId>/add-image
      - Header: Authorization: Bearer TOKEN
      - Param: <:collectionId> , where collectionId is id of collection which added image !
      - Request payload:
          ```
              {
                  image_id: string,
              }
              
              where field image_id is id of image which collection added.
          ```
      - Response:
          + OK:
              - Status Code: 200
              - Payload:
                  ```
                  {
                      status: true,
                      message: "Add image to collection {Collection Name} successfully !"
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
                  
  - **Delete Image From Collection**
       
       - DELETE api/collections/<:collectionId>/add-image
       - Header: Authorization: Bearer TOKEN
       - Param: <:collectionId> , where collectionId is id of collection which added image !
       - Request payload:
           ```
               {
                   image_id: string,
               }
               
               where field image_id is id of image which collection added.
           ```
       - Response:
           + OK:
               - Status Code: 200
               - Payload:
                   ```
                   {
                       status: true,
                       message: "Delete image from collection {Collection Name} successfully !"
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
  - **Get collection of a user**
        
       - GET api/collections
       - Header: Authorization: Bearer TOKEN
       - Request payload: None
       - Response:
            + OK:
                - Status Code: 200
                - Payload:
                    ```
                    {
                        "status": true,
                        "collections": [
                            list of collections
                        ]
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
  - **Get collection by Id**
          
      - GET api/collections/<:collection_id>
      - Header: Authorization: Bearer TOKEN
      - Param: <:collectionId> , where collectionId is id of collection.
      - Request payload: None
      - Response:
          + OK:
              - Status Code: 200
              - Payload:
                  ```
                  {
                      "status": true,
                      "collection": {
                        detail of collection
                      }
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