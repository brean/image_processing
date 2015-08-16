# -*- coding: utf-8 -*-
import os
from .task import Task
import hashlib
import shutil
import errno
BLOCKSIZE = 65536  # block size for hashing

class Folder(Task):
    name = 'image folder'

    def __init__(self, mgr, uuid, task_data):
        super(Folder, self).__init__(mgr, uuid, task_data)
        folder = task_data['config']['folder']
        if folder.startswith(os.sep):
            folder = folder[1:]
        self.folder = os.path.join('workspace', folder)

    def sha1(self, filename):
        """
        get sha1 hash from file (to check for file changes)
        """
        hasher = hashlib.sha1()
        with open(filename, 'rb') as afile:
            buf = afile.read(BLOCKSIZE)
            while len(buf) > 0:
                hasher.update(buf)
                buf = afile.read(BLOCKSIZE)
        return hasher.hexdigest()

    def copy_file(self, filename):
        """
        copy single file into folder
        (creates the folder if it does not exist, used by copy_files)
        """
        try:
            os.makedirs(self.folder)
        except OSError as exc: # Python >2.5
            if exc.errno == errno.EEXIST and os.path.isdir(self.folder):
                pass
            else: raise
        # use copy2 to copy metadata - can be useful to check if
        # file has changed
        shutil.copy2(filename, self.folder)

    def execute_task(self):
        # copy all files from connected tasks into folder
        for f in self.get_input_files():
            self.copy_file(f)
        # provide list of files inside folder for other tasks
        if 'output' in self.task_data:
            self.files = self.get_files(self.task_data['output'].keys())
        super(Folder, self).execute_task()

    def get_files(self, scopes):
        """
        get dict for all files that are required in other tasks (by scope)
        """
        data = {
            'image': [],
            'xml': []
        }
        scope_files = {
            'image': ['.png', '.jpg', '.jpeg', '.gif', '.tiff'],
            'xml': ['.xml']
        }

        files = os.listdir(self.folder)
        for f in files:
            ext = os.path.splitext(f)[1]
            filename = os.path.join(self.folder, f)
            for scope, endings in scope_files.items():
                if scope not in scopes:
                    # there is no output connection needing this files - ignore
                    continue
                if ext in endings:
                    data[scope].append(filename)
        return data
