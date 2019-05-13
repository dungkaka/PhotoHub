import {firestoreRef} from "../../config/firebase";


class TagDAO {
    private static tagsRef = firestoreRef.collection("tags");

    private static mergeTagsArray = (tagsDB: any[], tagsInput: any[]) => {
        let combine = [];
        for(let i in tagsInput){
            let shared = false;
            for (let j in tagsDB)
                if (tagsDB[j].id == tagsInput[i].id) {
                    tagsDB[j] = tagsInput[i];
                    shared = true;
                    break;
                }
            if(!shared) combine.push(tagsInput[i])
        }
        combine = combine.concat(tagsDB);
        return combine;
    };

    static updateTag = async (tags: any) => {
        const TagsQuerySnapshot = await TagDAO.tagsRef
            .where("category", "==", tags.category)
            .get();

        if (TagsQuerySnapshot.empty) {
            await TagDAO.tagsRef.add(tags);
            return tags;
        } else {
            let tagsResults: any;
            for (const doc of TagsQuerySnapshot.docs)  {
                const tagsDB = doc.data().tags ? doc.data().tags: [];
                const tagsInput = tags.tags;
                const combine = TagDAO.mergeTagsArray(tagsDB, tagsInput);

                await doc.ref.set({
                    tags: combine,
                }, {
                    merge: true
                });

                tagsResults = combine;
            }

            return tagsResults;
        }
    };


    static getTags = async () => {
        const tagsDataSnapShot = await TagDAO.tagsRef.get();

        const allTags: any[] = [];

        tagsDataSnapShot.forEach(doc => {
            allTags.push(doc.data());
        });

        return allTags;
    }
}


export default TagDAO;

