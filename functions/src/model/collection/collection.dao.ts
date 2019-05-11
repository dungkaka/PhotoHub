import {firestoreRef} from "../../config/firebase";

class CollectionDAO {
    private static collectionsRef: any;

    constructor(user_id: string) {
        CollectionDAO.collectionsRef = firestoreRef.collection("user").doc(user_id).collection("collections");
    }

    static getAllCollection = async () => {
        const collectionsQuerySnapshot = await CollectionDAO.collectionsRef.get();

        const listCollection: any[] = [];
        // @ts-ignore
        collectionsQuerySnapshot.forEach((doc) => {
            listCollection.push({...doc.data(), collection_id: doc.id});
        });

        return listCollection;
    }

    static createNewCollection = async (collection: CollectionCreateDTO) => {
        const collectionModel = await CollectionDAO.collectionsRef.add(collection);
        const collectionData = await collectionModel.get();
        return { ...collectionData.data(), collection_id: collectionData.id };
    }


}

export default CollectionDAO;