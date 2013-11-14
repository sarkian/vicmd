# coding: utf-8
# Last Change: 2013 Nov 14, 21:54

import os
import sys

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *

from app import App
from window import Window
from view import View
from scriptmanager import ScriptManager
from resourcemanager import ResourceManager
from ui import UI
from fs import FS


class ViCmd:

    def __init__(self, dbg=False):
        self.__dbg = dbg
        App.app = QApplication(sys.argv)
        App.window = Window(dbg)
        App.view = App.window.view
        App.window.show()
        App.resman = ResourceManager(os.path.dirname(os.path.realpath(__file__)))
        App.ui = UI()
        App.fs = FS()

    def run(self):
        self._createView()
        App.view.setHtml(self._html)
        App.view.page().mainFrame().addToJavaScriptWindowObject(
                'vicmd_fs', App.fs)
        App.view.page().mainFrame().addToJavaScriptWindowObject(
                'vicmd_ui', App.ui)
        App.app.exec_()

    def preview(self):
        self._createView()
        fname = '/tmp/vicmd-preview.html'
        f = open(fname, 'w+')
        f.write(self._html)
        f.close()
        os.system('open-url %s' % fname)

    def _createView(self):
        sm = ScriptManager()
        sm.addStyle('fonts')
        sm.addStyle('main')
        sm.addStyle('lib/jquery.mCustomScrollbar')
        sm.addScript('lib/jquery')
        sm.addScript('lib/jquery.mousewheel')
        sm.addScript('lib/jquery.mCustomScrollbar')
        sm.addScript('tabs')
        sm.addScript('tab')
        sm.addScript('pathbox')
        sm.addScript('pane')
        sm.addScript('panes')
        sm.addScript('file')
        sm.addScript('files')
        sm.addScript('kbd')
        sm.addScript('ui')
        sm.addScript('main')
        self._html = App.resman.render('main', {
            'HEAD_CONTENT': sm.render(4)
        })
