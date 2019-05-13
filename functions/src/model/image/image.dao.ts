import {firestoreRef} from "../../config/firebase";
import {Query} from "@google-cloud/firestore";

class ImageDAO {
    private static imagesRef = firestoreRef.collection("images");


    public static addImage = async (images: any) => {
        const imageRef = await ImageDAO.imagesRef.add(images);
        const image = await imageRef.get();
        return image.data();
    };

    public static getAllImage = async () => {
        const userDataQuerySnapshot = await ImageDAO.imagesRef.get();

        const listImage: any[] = [];
        userDataQuerySnapshot.forEach((doc) => {
            listImage.push({...doc.data(), image_id: doc.id});
        });

        return listImage;
    }

    public static findImageByTag = async (tags: any[]) => {
        let userDataQuerySnapshot: Query = ImageDAO.imagesRef;
        tags.forEach(tag => {
            if (tag !== false && tag !== "") {
                userDataQuerySnapshot = userDataQuerySnapshot.where(`tags.${tag}`, "==", true);
            }
        })

        const imageList = await userDataQuerySnapshot.get();

        const listImage: any[] = [];
        imageList.forEach((doc) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), tags: tagsArray});
        });

        return listImage;
    }


}

export default ImageDAO;