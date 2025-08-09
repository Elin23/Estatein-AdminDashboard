import { useEffect } from "react";
import { get, ref } from "firebase/database";
import { db } from "../firebaseConfig";

function DebugFirebase() {
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(db, "/"));
      console.log(snapshot.val());
    };

    fetchData();
  }, []);

  return <p>Check console</p>;
}

export default DebugFirebase;
