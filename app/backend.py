# coding: utf-8
# Last Change: 2014 Jan 14, 12:26

import os
import glob
import json
import time

from PyQt4.QtCore import *
from PyQt4.QtGui import *

from app import App
from state import State


class Backend(QObject):

    def __init__(self):
        super(QObject, self).__init__()
        self.initAppdir()
        
    @pyqtSlot(QVariant)
    def log(self, val):
        print val.toPyObject()

    @pyqtSlot()
    def ready(self):
        self.loadState()
        self.evalJS('ui.ready()')

    @pyqtSlot(str, result=QVariant)
    def readdir(self, path):
        path = unicode(path)
        parent_path = os.path.dirname(path)
        parent_name = os.path.basename(path)
        res = [{
            
        }]
        res = {
            'success': True,
            'error': '',
            'files': [{
                'name': '..',
                'path': parent_path,
                'parent_name': parent_name,
                'type': 'dir'
            }]
        }
        try:
            files = os.listdir(path)
            files.sort()
            for fname in files:
                rfname = os.path.join(path, fname)
                node = {'name': fname, 'path': rfname, 'parent_name': parent_name}
                if os.path.isdir(rfname):
                    node['type'] = 'dir'
                elif os.path.islink(rfname):
                    node['type'] = 'link'
                else:
                    node['type'] = 'file'
                res['files'].append(node)
        except OSError, e:
            res['success'] = False
            res['error'] = e.strerror
        finally:
            #print res.files
            return res

    @pyqtSlot(QVariant)
    def saveState(self, _state):
        state = State().fromQVariant(_state)
        state.save(os.path.join(self.appdir, 'state.json'))

    @pyqtSlot()
    def quit(self):
        App.app.quit()

    def evalJS(self, code):
        App.view.page().mainFrame().evaluateJavaScript(code)

    def initAppdir(self):
        self.homedir = os.path.expanduser('~')
        if os.path.exists(os.path.join(self.homedir, '.config')):
            self.appdir = os.path.join(self.homedir, '.config', 'vicmd')
        else:
            self.appdir = os.path.join(self.homedir, '.vicmd')
        if os.path.exists(self.appdir):
            if not os.path.isdir(self.appdir):
                os.remove(self.appdir)
        else:
            os.mkdir(self.appdir)

    def loadState(self):
        try:
            state = State().fromFile(os.path.join(self.appdir, 'state.json'))
        except IOError:
            state = State().fromJSON(self.createDefaultState())
        finally:
            state.load()

    def createDefaultState(self):
        state = {
            'panes': {
                'left': {
                    'tabs': [{
                        'path': os.path.expanduser('~'),
                        'show_hidden': False
                    }]
                },
                'right': {
                    'tabs': [{
                        'path': os.path.expanduser('~'),
                        'show_hidden': False
                    }]
                },
            }
        }
        sfile = open(os.path.join(self.appdir, 'state.json'), 'w+')
        json.dump(state, sfile, indent=4)
        return state

