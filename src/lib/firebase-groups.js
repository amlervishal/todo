import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  where,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

// Group Management Functions
export const createGroup = async (userId, groupName) => {
  try {
    return await addDoc(collection(db, `users/${userId}/groups`), {
      name: groupName.trim(),
      createdAt: serverTimestamp(),
      order: Date.now() // Use timestamp for ordering
    });
  } catch (error) {
    console.error("Create group error:", error);
    throw error;
  }
};

export const getGroups = (userId, setGroups) => {
  if (!userId) return () => {};
  
  try {
    const q = query(
      collection(db, `users/${userId}/groups`),
      orderBy("order", "asc")
    );
    
    return onSnapshot(q, (snapshot) => {
      setGroups(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    }, (error) => {
      console.error("Get groups error:", error);
    });
  } catch (error) {
    console.error("Setup groups error:", error);
    return () => {};
  }
};

export const updateGroup = async (userId, groupId, updates) => {
  try {
    const groupRef = doc(db, `users/${userId}/groups/${groupId}`);
    await updateDoc(groupRef, updates);
  } catch (error) {
    console.error("Update group error:", error);
    throw error;
  }
};

export const deleteGroup = async (userId, groupId, moveTasksToGroupId = null) => {
  try {
    const batch = writeBatch(db);
    
    // If a target group is specified, move tasks there
    if (moveTasksToGroupId) {
      const tasksQuery = query(collection(db, `users/${userId}/groups/${groupId}/tasks`));
      const taskSnapshot = await getDocs(tasksQuery);
      
      // For each task in the group being deleted
      for (const taskDoc of taskSnapshot.docs) {
        const taskData = taskDoc.data();
        
        // Create a new task in the target group
        const targetGroupTasksRef = collection(db, `users/${userId}/groups/${moveTasksToGroupId}/tasks`);
        await addDoc(targetGroupTasksRef, {
          ...taskData,
          movedAt: serverTimestamp()
        });
        
        // Delete the original task
        batch.delete(taskDoc.ref);
      }
    } else {
      // If no target group, just delete all tasks in the group
      const tasksQuery = query(collection(db, `users/${userId}/groups/${groupId}/tasks`));
      const taskSnapshot = await getDocs(tasksQuery);
      
      taskSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
    }
    
    // Delete the group itself
    const groupRef = doc(db, `users/${userId}/groups/${groupId}`);
    batch.delete(groupRef);
    
    // Commit all the operations
    await batch.commit();
  } catch (error) {
    console.error("Delete group error:", error);
    throw error;
  }
};

// Tasks Management Functions
export const addTaskToGroup = async (userId, groupId, taskText) => {
  try {
    return await addDoc(collection(db, `users/${userId}/groups/${groupId}/tasks`), {
      text: taskText.trim(),
      completed: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Add task to group error:", error);
    throw error;
  }
};

export const getTasksInGroup = (userId, groupId, setTasks) => {
  if (!userId || !groupId) return () => {};
  
  try {
    const q = query(
      collection(db, `users/${userId}/groups/${groupId}/tasks`),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          groupId,
          ...doc.data()
        }))
      );
    }, (error) => {
      console.error("Get tasks in group error:", error);
    });
  } catch (error) {
    console.error("Setup group tasks error:", error);
    return () => {};
  }
};

export const toggleTaskInGroup = async (userId, groupId, taskId, currentCompletedState) => {
  try {
    const taskRef = doc(db, `users/${userId}/groups/${groupId}/tasks/${taskId}`);
    await updateDoc(taskRef, {
      completed: !currentCompletedState
    });
  } catch (error) {
    console.error("Toggle task in group error:", error);
    throw error;
  }
};

export const updateTaskInGroup = async (userId, groupId, taskId, updates) => {
  try {
    const taskRef = doc(db, `users/${userId}/groups/${groupId}/tasks/${taskId}`);
    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error("Update task in group error:", error);
    throw error;
  }
};

export const deleteTaskFromGroup = async (userId, groupId, taskId) => {
  try {
    const taskRef = doc(db, `users/${userId}/groups/${groupId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Delete task from group error:", error);
    throw error;
  }
};

export const clearCompletedTasksInGroup = async (userId, groupId) => {
  try {
    const batch = writeBatch(db);
    const tasksQuery = query(
      collection(db, `users/${userId}/groups/${groupId}/tasks`),
      where("completed", "==", true)
    );
    
    const snapshot = await getDocs(tasksQuery);
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Clear completed tasks in group error:", error);
    throw error;
  }
};

// Migration Function - Run once per user
export const migrateExistingTasks = async (userId) => {
  try {
    // Check if migration has already happened
    const migrationFlagRef = doc(db, `users/${userId}/settings/migration`);
    const migrationDoc = await getDoc(migrationFlagRef);
    
    if (migrationDoc.exists() && migrationDoc.data().tasksToGroupsMigrated) {
      console.log("Migration already completed for this user");
      return;
    }
    
    // Create default group
    const defaultGroupRef = await addDoc(collection(db, `users/${userId}/groups`), {
      name: "My Tasks",
      createdAt: serverTimestamp(),
      order: 0,
      isDefault: true
    });
    
    // Get all existing tasks
    const tasksQuery = query(
      collection(db, `users/${userId}/tasks`),
      orderBy("createdAt", "desc")
    );
    
    const taskSnapshot = await getDocs(tasksQuery);
    
    // No tasks to migrate
    if (taskSnapshot.empty) {
      // Just set the migration flag
      await setDoc(migrationFlagRef, {
        tasksToGroupsMigrated: true,
        migratedAt: serverTimestamp()
      }, { merge: true });
      return;
    }
    
    // Move all tasks to the default group
    const batch = writeBatch(db);
    
    for (const taskDoc of taskSnapshot.docs) {
      const taskData = taskDoc.data();
      
      // Create task in new group
      await addDoc(
        collection(db, `users/${userId}/groups/${defaultGroupRef.id}/tasks`),
        {
          ...taskData,
          migratedAt: serverTimestamp()
        }
      );
      
      // Delete original task (optional - you could keep them as backup)
      // batch.delete(taskDoc.ref);
    }
    
    // Set migration flag
    await setDoc(migrationFlagRef, {
      tasksToGroupsMigrated: true,
      migratedAt: serverTimestamp()
    }, { merge: true });
    
    await batch.commit();
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
};
