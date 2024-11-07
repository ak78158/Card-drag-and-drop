import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { ProductType } from "../../types/types";

const saveDataToApi = async (data: ProductType[]) => {
  console.log("data", data);
  const response = await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  console.log("response", response, data);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Error saving data");
  }
};

const saveData = async (data: ProductType[]) => {
  await saveDataToApi(data);
  return new Date();
};

type AutoSaveComponentProps = {
  data: ProductType[];
  hasChanges: boolean;
  setHasChanges: Dispatch<React.SetStateAction<boolean>>;
};

const AutoSaveComponent: React.FC<AutoSaveComponentProps> = ({
  data,
  hasChanges,
  setHasChanges,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const save = useCallback(
    async (data: ProductType[]) => {
      setIsSaving(true);
      await saveData(data);
      setLastSaved(new Date());
      setHasChanges(false);
      setIsSaving(false);
    },
    [setHasChanges],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChanges && data) {
        save(data);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasChanges, data, save]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (lastSaved) {
        setElapsedTime(
          Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000),
        );
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [lastSaved]);

  return (
    <div>
      {isSaving ? (
        <div>Saving... Please wait.</div>
      ) : (
        <div>
          Last saved: {lastSaved ? lastSaved.toLocaleTimeString() : "Never"}
          <br />
          Time since last save: {elapsedTime} seconds
        </div>
      )}
    </div>
  );
};

export default AutoSaveComponent;
