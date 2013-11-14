# coding: utf-8
# Last Change: 2013 Nov 14, 23:11

import os
import glob

from PyQt4.QtCore import *
from PyQt4.QtGui import *

from app import App


class UI(QObject):

    @pyqtSlot()
    def ready(self):
        self.evalJS('ui.panes.selectLeft()')
        self.evalJS('ui.panes.left.tabs.add("%s")' % os.path.expanduser('~'))
        self.evalJS('ui.panes.right.tabs.add("/")')
        self.evalJS('ui.panes.left.tabs.select(0)')
        self.evalJS('ui.panes.right.tabs.select(0)')

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

    def evalJS(self, code):
        App.view.page().mainFrame().evaluateJavaScript(code)

