# coding: utf-8
# Last Change: 2013 Nov 15, 21:09

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *

from view import View


class Window(QWidget):

    def __init__(self, dbg=False):
        super(Window, self).__init__()
        self.view = View(self)
        s = QShortcut(self)
        s.setKey(Qt.Key_Tab)
        s.activated.connect(self.tabKeyPressed)
        self.splitter = QSplitter(self)
        self.splitter.setOrientation(Qt.Vertical)
        layout = QVBoxLayout(self)
        layout.setMargin(0)
        layout.addWidget(self.splitter)
        self.splitter.addWidget(self.view)
        if dbg:
            self.setupInspector()
            self.splitter.addWidget(self.inspector)
        else:
            self.view.mouseDoubleClickEvent = lambda e: e.ignore()
            self.view.mouseMoveEvent = lambda e: e.ignore()
            self.view.mousePressEvent = lambda e: e.ignore()
            self.view.mouseReleaseEvent = lambda e: e.ignore()
            self.view.wheelEvent = lambda e: e.ignore()
            self.view.setContextMenuPolicy(Qt.NoContextMenu)

    def tabKeyPressed(self):
        e = QKeyEvent(QEvent.KeyPress, Qt.Key_Tab, Qt.NoModifier)
        self.view.keyReleaseEvent(e)

    def setupInspector(self):
        page = self.view.page()
        page.settings().setAttribute(QWebSettings.DeveloperExtrasEnabled, True)
        self.inspector = QWebInspector(self)
        self.inspector.setPage(page)
        shortcut = QShortcut(self)
        shortcut.setKey(Qt.Key_F12)
        shortcut.activated.connect(self.toggleInspector)
        self.inspector.setVisible(False)

    def toggleInspector(self):
        self.inspector.setVisible(not self.inspector.isVisible())

