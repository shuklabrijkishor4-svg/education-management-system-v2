import { useState, useEffect } from "react";
import { api } from "./api.js";

// Loads the active courses from the database (public, no login needed)
export default function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/courses")
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}
