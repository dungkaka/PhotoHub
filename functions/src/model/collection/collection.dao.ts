import {firestoreRef} from "../../config/firebase";
import HttpException from "../../exception/HttpException";

class CollectionDAO {
    private static imagesRef = firestoreRef.collection("images");
    private collectionsRef: any;

    constructor(user_id: any) {
        this.collectionsRef = firestoreRef.collection("users").doc(user_id).collection("collections");
    }

    convertToCollectionModel = (collection: CollectionCreateDTO) => {
        return {
            name: collection.name,
            date_create: "2018-1-1",
            images_snippet: [],
        }
    }

    findCollectionsById = async (collectionId: string) => {
        const collectionRef = this.collectionsRef.doc(collectionId);
        const collection = await collectionRef.get();

        return {...collection.data(), id: collection.id}
    };

    findCollectionsByName = async (collectionName: string) => {
        const collectionRef = this.collectionsRef.where("name", "==", collectionName);
        const collections = await collectionRef.get();

        const listCollections: any[] = [];

        collections.forEach((collection: any) => {
                listCollections.push({...collection, id: collection.id});
            }
        );
        return listCollections;
    };

    findFavouriteCollection = async () => {
        const favouriteCollections = await this.findCollectionsByName("Favourite");
        return favouriteCollections[0];
    };

    getAllCollection = async () => {
        const collectionsQuerySnapshot = await this.collectionsRef.get();

        const listCollection: any[] = [];
        // @ts-ignore
        collectionsQuerySnapshot.forEach((doc) => {
            listCollection.push({...doc.data(), collection_id: doc.id});
        });

        console.log(listCollection);

        return listCollection;
    };

    createNewCollection = async (collection: any) => {
        const collections = await this.collectionsRef.where("name", "==", collection.name).get();

        if (collections.docs.length !== 0) {
            throw new HttpException(400, "Already exist collection" + collection.name);
        } else {
            const collectionModel = await this.collectionsRef.add(collection);
            const collectionData = await collectionModel.get();
            return {...collectionData.data(), collection_id: collectionData.id};
        }
    };

    addImageToCollection = async (image_id: any, collection_id: any) => {
        const image = await CollectionDAO.imagesRef.doc(image_id).get();
        const imageData = image.data();

        const collectionRef = this.collectionsRef.doc(collection_id);
        const collection = await collectionRef.get();
        const collectionData = collection.data();

        if (collectionData && imageData) {
            const images_snippet = collectionData.images_snippet;

            if (images_snippet.filter((item: any) => item.image_id === image_id).length === 0) {
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
    };

    deletedImageFromCollection = async (image_id: any, collection_id: any) => {
        const image = await CollectionDAO.imagesRef.doc(image_id).get();
        const imageData = image.data();

        const collectionRef = this.collectionsRef.doc(collection_id);
        const collection = await collectionRef.get();
        const collectionData = collection.data();

        if (collectionData && imageData) {
            let images_snippet = collectionData.images_snippet;

            console.log(images_snippet, image_id);
            if (images_snippet.filter((item: any) => item.image_id === image_id).length > 0) {
                images_snippet = images_snippet.filter((item: any) => item.image_id !== image_id)
            } else {
                throw new HttpException(400, "Image doesn't exist in collection \"" + collectionData.name + "\"");
            }

            await collectionRef.set({
                images_snippet,
            }, {merge: true});

            return {
                message: "Deleted image from collection \"" + collectionData.name + "\" successfully !",
            }
        } else {
            throw new HttpException(400, "Collection or Image does not exist !")
        }
    }


}

export default CollectionDAO;