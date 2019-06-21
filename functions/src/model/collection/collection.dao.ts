import {firestoreRef} from "../../config/firebase";
import HttpException from "../../exception/HttpException";

class CollectionDAO {
    private static imagesRef = firestoreRef.collection("images");
    private collectionsRef: any;

    constructor(user_id: string) {
        this.collectionsRef = firestoreRef.collection("users").doc(user_id).collection("collections");
    }

    convertToCollectionModel = (collection: CollectionCreateDTO) => {
        return {
            name: collection.name,
            date_create: "2018-1-1",
            images_snippet: [],
        }
    }

    getAllCollection = async () => {
        const collectionsQuerySnapshot = await this.collectionsRef.get();

        const listCollection: any[] = [];
        // @ts-ignore
        collectionsQuerySnapshot.forEach((doc) => {
            listCollection.push({...doc.data(), collection_id: doc.id});
        });

        console.log(listCollection);

        return listCollection;
    }

    createNewCollection = async (collection: any) => {
        const collectionModel = await this.collectionsRef.add(collection);
        const collectionData = await collectionModel.get();
        return {...collectionData.data(), collection_id: collectionData.id};
    }

    addImageToCollection = async (image_id: any, collection_id: any) => {
        const image = await CollectionDAO.imagesRef.doc(image_id).get();
        const imageData = image.data();

        const collectionRef = this.collectionsRef.doc(collection_id);
        const collection = await collectionRef.get();
        const collectionData = collection.data();

        if (collectionData && imageData) {
            const images_snippet = collectionData.images_snippet;

            if (images_snippet.filter((item: any) => item.image_id === image_id) <= 0) {
                images_snippet.push({
                    image_id: image_id,
                    thumbnail_url: imageData.thumbnail_url,
                });
            } else {
                throw new HttpException(400, "Image already in collection \"" + collectionData.name + "\"");
            }

            await collectionRef.set({
                images_snippet,
            }, {merge: true});

            return {
                message: "Add image to collection \"" + collectionData.name + "\" successfully !",
            }
        } else {
            throw new HttpException(400, "Collection or Image does not exist !")
        }
    }


}

export default CollectionDAO;