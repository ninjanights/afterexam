import React, { useEffect, useState } from "react";

import { useStudentSubject } from "../contexts/AsStudentContext.jsx";

function EachInterest() {
  const { fetchInterests, topicValues, topicName, setTopicValuesC } =
    useStudentSubject();

  // copied values for ui updation.
  const [localTopics, setLocalTopics] = useState([]);

  // store original values for reset.
  const [originalValues, setoriginalValues] = useState([]);

  // sync local state for inc-dec.
  useEffect(() => {
    if (Array.isArray(topicValues)) {
      setLocalTopics([...topicValues]);
      setoriginalValues([...topicValues]);
    }
  }, [topicValues]);

  // increse/decrese rating for specific topic.
  const changeRating = (e, idx, way) => {
    e.preventDefault();
    setLocalTopics((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              rating:
                way === "up"
                  ? Math.min(item.rating + 1, 10)
                  : Math.max(item.rating - 1, 0),
            }
          : item
      )
    );
  };

  // reset to default value.
  const resetToDefaultValue = () => {
    setLocalTopics([...topicValues]);
  };

  // set new Values (of Topic).
  const handleSetNewValue = async (e, localTopics, topicName) => {
    e.preventDefault();
    const res = await setTopicValuesC(localTopics, topicName);

    console.log(res);
  };

  return (
    <div className="interestContainer">
      <p className="topicName">{topicName}</p>
      <button onClick={() => resetToDefaultValue()}>Reset</button>
      <button
        className="downBtn"
        onClick={(e) => handleSetNewValue(e, topicName, localTopics)}
      >
        set
      </button>
      <div className="graphBox">
        {Array.isArray(topicValues) &&
          localTopics.map((t, i) => (
            <div key={i} className="eachTopicContainer">
              <div className="barAndText">
                <div className="ratingBarWrapper">
                  <div className="btns">
                    <button
                      disabled={t.rating >= 10}
                      className="upBtn"
                      onClick={(e) => changeRating(e, i, "up")}
                    >
                      up
                    </button>
                    <button
                      disabled={t.rating <= 0}
                      className="downBtn"
                      onClick={(e) => changeRating(e, i, "down")}
                    >
                      down
                    </button>
                  </div>

                  <div
                    className="ratingBarFill"
                    style={{ height: `${t.rating * 10}%` }}
                  ></div>
                  <span className="ratingVal">{`${t.rating * 10}%`}</span>
                </div>

                <span className="ratingText">{t.topic}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default EachInterest;
