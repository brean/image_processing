# -*- coding: utf-8 -*-
class Task(object):
    def __init__(self, mgr, uuid, task_data):
        self.mgr = mgr
        self.uuid = uuid
        self.task_data = task_data
        self.files = {
            'images': {},
            'xml': {}
        }
        self.finished = False

    def cleanup(self):
        """
        delete temp folder etc.
        """
        pass

    def process_input(self):
        """
        collect files from all input-connections
        """
        pass

    def execute_task(self):
        """
        execute task and set finished
        """
        self.finished =  True

    def get_input_files(self):
        files = []
        if 'input' in self.task_data:
            inputs = self.task_data['input']
            for scope, uuids in inputs.items():
                for uuid in uuids:
                    task = self.mgr.tasks[uuid]
                    assert task.finished
                    files += task.files[scope]
        return files

    def run(self, scope=None):
        """
        execute this task
        (save result in self.files)
        """
        if self.finished:
            return
        self.execute_task()
        # this task is done run all tasks that require this one next
        if 'output' in self.task_data:
            for scope, uuids in self.task_data['output'].items():
                for uuid in uuids:
                    task = self.mgr.tasks[uuid]
                    self.mgr.run_task(task)
