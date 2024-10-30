import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "./lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { ThemeToggle } from "./components/ThemeToggle";
import { ProgressBar } from "./components/ProgressBar";
import { TodoItem } from "./components/TodoItem";
import { AddTodoForm } from "./components/AddTodoForm";
import { ThemeProvider } from "./context/ThemeContext";

const TodoApp = () => {
  // ... keep all state and handlers the same ...
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // ... keep all useEffect and handler functions exactly the same ...
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setError(null);
      },
      (error) => {
        console.error("Auth error:", error);
        setError("Authentication failed. Please try again.");
      }
    );

    if (user) {
      try {
        const q = query(
          collection(db, `users/${user.uid}/tasks`),
          orderBy("createdAt", "desc")
        );

        const unsubTasks = onSnapshot(
          q,
          (snapshot) => {
            setTasks(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );
            setError(null);
          },
          (error) => {
            console.error("Firestore error:", error);
            setError("Failed to load tasks. Please check your connection.");
          }
        );

        return () => {
          unsubTasks();
          unsubAuth();
        };
      } catch (error) {
        console.error("Setup error:", error);
        setError("Failed to setup task listener. Please refresh the page.");
      }
    }

    return unsubAuth;
  }, [user]);

  const handleAddTask = async (text) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/tasks`), {
        text: text.trim().toUpperCase(),
        completed: false,
        createdAt: new Date().toISOString(),
      });
      setError(null);
    } catch (error) {
      console.error("Add task error:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  const handleToggle = async (taskId) => {
    if (!user) return;
    try {
      const task = tasks.find((t) => t.id === taskId);
      const taskRef = doc(db, `users/${user.uid}/tasks/${taskId}`);
      await updateDoc(taskRef, {
        completed: !task.completed,
      });
      setError(null);
    } catch (error) {
      console.error("Toggle task error:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleReset = async () => {
    if (!user || isResetting) return;

    try {
      setIsResetting(true);
      const batch = writeBatch(db);
      const completedTasksQuery = query(
        collection(db, `users/${user.uid}/tasks`)
      );
      const snapshot = await getDocs(completedTasksQuery);

      snapshot.docs.forEach((doc) => {
        if (doc.data().completed) {
          batch.delete(doc.ref);
        }
      });

      await batch.commit();
      setError(null);
    } catch (error) {
      console.error("Reset error:", error);
      setError("Failed to reset tasks. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError(null);
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please try again.");
    }
  };

  const AppContent = () => {
    if (!user) {
      return (
        <div
          className="min-h-screen bg-white dark:bg-black 
          flex flex-col items-center justify-center gap-4 p-6 
          text-gray-800 dark:text-terminal-green transition-colors"
        >
          <button
            onClick={handleSignIn}
            className="border px-4 py-2 font-mono transition-colors
              border-gray-800 dark:border-terminal-green
              hover:bg-gray-800 hover:text-white
              dark:hover:bg-terminal-green dark:hover:text-black"
          >
            SIGN IN WITH GOOGLE
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      );
    }

    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 10) : 0;

    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors">
        <ThemeToggle />
        <div className="p-6 pb-20 font-mono text-gray-800 dark:text-terminal-green">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8 pr-10">
              <div className="text-xs opacity-50">{user.email}</div>
              <button
                onClick={() => auth.signOut()}
                className="text-xs opacity-50 hover:opacity-100"
              >
                [SIGN OUT]
              </button>
            </div>

            <ProgressBar progress={progress} />

            <AddTodoForm onAdd={handleAddTask} />

            {error && <div className="text-red-500 text-sm my-4">{error}</div>}

            <div className="space-y-4">
              {tasks.map((task) => (
                <TodoItem key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
          <button
            onClick={handleReset}
            disabled={isResetting || completedTasks === 0}
            className={`text-xs transition-opacity ${
              completedTasks === 0
                ? "opacity-30"
                : "opacity-50 hover:opacity-100"
            } text-gray-800 dark:text-terminal-green`}
          >
            {isResetting ? "[RESETTING...]" : "[CLEAR COMPLETED]"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default TodoApp;
