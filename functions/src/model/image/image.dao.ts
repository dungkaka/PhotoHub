import {firestoreRef} from "../../config/firebase";
import {Query} from "@google-cloud/firestore";

class ImageDAO {
    private static imagesRef = firestoreRef.collection("images");


    public static getAllImage = async () => {
        const userDataQuerySnapshot = await ImageDAO.imagesRef.get();

        const listImage: any[] = [];
        userDataQuerySnapshot.forEach((doc) => {
            listImage.push(doc.data());
        });

        return listImage;
    }

    public static findImageByTag = async (tag: any) => {
        let userDataQuerySnapshot: Query = ImageDAO.imagesRef;
        for (const field in tag) {
            if (tag[field] && tag[field] !== "") {
                userDataQuerySnapshot = userDataQuerySnapshot.where(`tags.${field}`, "==", tag[field]);
            }
        }

        const imageList = await userDataQuerySnapshot.get();

        const listImage: any[] = [];
        imageList.forEach((doc) => {
            listImage.push({...doc.data(), image_id: doc.id});
        });

        return listImage;
    }


}

export default ImageDAO;