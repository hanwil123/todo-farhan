import supabase from "@/app/lib/supabase";

interface LogDetails {
  task_id: string;
  action: 'create' | 'update';
  user_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  old_values?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new_values?: Record<string, any>;
}

export async function logTaskActivity(details: LogDetails) {
  try {
    const { data, error } = await supabase
      .from("task_logss")
      .insert([{
        user_id: details.user_id,
        task_id: details.task_id,
        action: details.action,
        details: {
          changes: details.changes || {},
          old_values: details.old_values || {},
          new_values: details.new_values || {}
        }
      }]);

    if (error) {
      console.error("Error logging task activity:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception logging task activity:", error);
    return { success: false, error };
  }
}

export async function getTaskLogs(filters?: {
  task_id?: string;
  user_id?: string;
  from_date?: Date;
  to_date?: Date;
}) {
  try {
    let query = supabase
      .from("task_logs")
      .select(`
        id,
        user_id,
        task_id, 
        action,
        details,
        created_at,
        users:user_id (id, username, full_name),
        taskss:task_id (id, title, status)
      `)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters?.task_id) {
      query = query.eq('task_id', filters.task_id);
    }
    
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters?.from_date) {
      query = query.gte('created_at', filters.from_date.toISOString());
    }
    
    if (filters?.to_date) {
      query = query.lte('created_at', filters.to_date.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching task logs:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception fetching task logs:", error);
    return { success: false, error };
  }
}