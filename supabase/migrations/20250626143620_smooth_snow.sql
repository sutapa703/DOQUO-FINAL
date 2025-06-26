/*
  # Create tasks table for Kanban board

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `status` (text, enum: todo, in-progress, done)
      - `priority` (text, enum: low, medium, high)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to manage their own tasks
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO tasks (title, description, status, priority, created_by) VALUES
  ('Setup project structure', 'Create the basic project structure and components', 'done', 'high', '00000000-0000-0000-0000-000000000000'),
  ('Implement authentication', 'Add Supabase authentication with login and register', 'done', 'medium', '00000000-0000-0000-0000-000000000000'),
  ('Create Kanban board', 'Build the main Kanban board with drag and drop functionality', 'in-progress', 'high', '00000000-0000-0000-0000-000000000000'),
  ('Add task management', 'Implement CRUD operations for tasks', 'in-progress', 'medium', '00000000-0000-0000-0000-000000000000'),
  ('Responsive design', 'Make the app fully responsive for mobile and desktop', 'todo', 'medium', '00000000-0000-0000-0000-000000000000'),
  ('Add team collaboration', 'Implement real-time updates and team member management', 'todo', 'low', '00000000-0000-0000-0000-000000000000');