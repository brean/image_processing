# -*- coding: utf-8 -*-
class TaskManager(object):
    def __init__(self):
        self.tasks = {}  #  all known tasks by uuid
        self.task_classes = {}

    def register_task(self, name, _class):
        self.task_classes[name] = _class

    def create_task(self, name, uuid, task_data=None):
        task = self.task_classes[name](self, uuid, task_data)
        self.tasks[uuid] = task
        return task

    def run_task(self, task):
        """
        run a task (and all tasks that require this one)
        """

        # get all required tasks:
        if 'input' in task.task_data:
            for scope, uuids in task.task_data['input'].items():
                for uuid in uuids:
                    self.run_task(self.tasks[uuid])
        task.run()

    def run(self):
        """
        execute all tasks
        beginning from tasks that does not have any input going
        through all its output connections, executing them and their required
        inputs.
        """
        for task in self.tasks.values():
            task.finished = False

        # find roots and execute required tasks from there
        roots = []
        for uuid, task in self.tasks.items():
            task_data = task.task_data
            if 'output' in task_data and 'input' not in task_data:
                roots.append(task)
        for task in roots:
            self.run_task(task)
        # cleanup when all is done
        for task in self.tasks.values():
            task.cleanup()
