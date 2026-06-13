import { Show, useRecordContext } from "react-admin";


export const SpeakerShowName = () => {
     const record = useRecordContext();

    return record ? (
        <span>
          {record.firstName}
        </span>
    ) : null;
}


 

