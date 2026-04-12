import { useState } from "react";

const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);

  const run = async (fn) => {
    if (loading) return;

    try {
      setLoading(true);
      const result = await fn();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, run };
};

export default useAsyncAction;