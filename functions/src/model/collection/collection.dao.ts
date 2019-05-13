import {firestoreRef} from "../../config/firebase";

class CollectionDAO {
    private collectionsRef: any;

    constructor(user_id: string) {
        this.collectionsRef = firestoreRef.collection("users").doc(user_id).collection("collections");
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

    createNewCollection = async (collection: CollectionCreateDTO) => {
        const collectionModel = await this.collectionsRef.add(collection);
        const collectionData = await collectionModel.get();
        return { ...collectionData.data(), collection_id: collectionData.id };
    }


}

export default CollectionDAO;