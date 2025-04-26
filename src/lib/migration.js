import { db } from './firebase';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

// Check if a user needs migration
export const checkMigrationStatus = async (userId) => {
  try {
    // Check if migration flag exists
    const migrationFlagRef = doc(db, `users/${userId}/settings/migration`);
    const migrationDoc = await getDoc(migrationFlagRef);
    
    // If migration doc exists and migration is done, return complete
    if (migrationDoc.exists() && migrationDoc.data().tasksToGroupsMigrated) {
      console.log("Migration already completed");
      return { status: "complete" };
    }
    
    // Check if there are groups already
    const groupsQuery = query(collection(db, `users/${userId}/groups`));
    const groupsSnapshot = await getDocs(groupsQuery);
    
    if (!groupsSnapshot.empty) {
      console.log("Groups exist but migration flag not set, fixing...");
      await setDoc(migrationFlagRef, {
        tasksToGroupsMigrated: true,
        migratedAt: serverTimestamp()
      }, { merge: true });
      return { status: "complete" };
    }
    
    // Check if there are tasks to migrate
    const tasksQuery = query(collection(db, `users/${userId}/tasks`));
    const tasksSnapshot = await getDocs(tasksQuery);
    
    if (tasksSnapshot.empty) {
      // No tasks to migrate, just create default group
      return { status: "no_tasks", needsMigration: true };
    }
    
    // Has tasks to migrate
    return { 
      status: "needs_migration", 
      needsMigration: true,
      taskCount: tasksSnapshot.size 
    };
    
  } catch (error) {
    console.error("Migration status check error:", error);
    return { status: "error", error };
  }
};

// Perform the actual migration
export const migrateToGroups = async (userId) => {
  try {
    console.log("Starting migration process for user:", userId);
    
    // Create default group
    const defaultGroupRef = await addDoc(collection(db, `users/${userId}/groups`), {
      name: "My Tasks",
      createdAt: serverTimestamp(),
      order: 0,
      isDefault: true
    });
    
    console.log("Created default group with ID:", defaultGroupRef.id);
    
    // Get all existing tasks
    const tasksQuery = query(
      collection(db, `users/${userId}/tasks`),
      orderBy("createdAt", "desc")
    );
    
    const taskSnapshot = await getDocs(tasksQuery);
    
    if (taskSnapshot.empty) {
      console.log("No tasks to migrate");
      
      // Set migration flag
      const migrationFlagRef = doc(db, `users/${userId}/settings/migration`);
      await setDoc(migrationFlagRef, {
        tasksToGroupsMigrated: true,
        migratedAt: serverTimestamp()
      }, { merge: true });
      
      return { 
        status: "success", 
        message: "Migration completed - no tasks needed migration" 
      };
    }
    
    console.log(`Migrating ${taskSnapshot.size} tasks...`);
    
    // Create batch for efficient writing
    const batch = writeBatch(db);
    let migratedCount = 0;
    
    // Process tasks in batches of 500 (Firestore limit)
    const processTasks = async (tasks) => {
      for (const taskDoc of tasks) {
        const taskData = taskDoc.data();
        
        // Add to new group structure
        await addDoc(
          collection(db, `users/${userId}/groups/${defaultGroupRef.id}/tasks`),
          {
            ...taskData,
            migratedAt: serverTimestamp()
          }
        );
        
        migratedCount++;
      }
    };
    
    // Process all tasks
    await processTasks(taskSnapshot.docs);
    
    // Set migration flag
    const migrationFlagRef = doc(db, `users/${userId}/settings/migration`);
    await setDoc(migrationFlagRef, {
      tasksToGroupsMigrated: true,
      migratedAt: serverTimestamp(),
      tasksMigrated: migratedCount
    }, { merge: true });
    
    console.log(`Migration completed. Migrated ${migratedCount} tasks.`);
    
    return { 
      status: "success", 
      message: `Migration completed. Migrated ${migratedCount} tasks.` 
    };
    
  } catch (error) {
    console.error("Migration error:", error);
    return { status: "error", error: error.message };
  }
};
