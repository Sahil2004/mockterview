import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const Question = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      setData(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {data.map((item) => (
          <ul>
            <li>{item.id}</li>
            <li>{item.statement}</li>
            <li>{item.input}</li>
            <li>{item.output}</li>
            <li>{item.ex_input}</li>
            <li>{item.ex_output}</li>
            {item.tags.map((tag) => (
                <p>{tag}</p>
            ))}
          </ul>
        ))}
      </ul>
    </div>
  );
};

export default Question;
