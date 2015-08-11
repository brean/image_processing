class Task(object):
    def __init__(self, task_data, required_tasks):
        self.required_tasks = required_tasks
        self.task_data = task_data
        self.ready = False

    def cleanup(self):
        """
        delete temp folder etc.
        """
        pass

    def run(self):
        files = {}
        for task in self.required_tasks:
            task_files = task.run()
            for scope in ['image', 'xml']:
                if scope in task_files:
                    files.setdefault(scope, [])
                    files[scope].extend(task_files[scope])
        return files
