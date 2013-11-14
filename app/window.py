# coding: utf-8
# Last Change: 2013 Nov 12, 13:31

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *

from view import View


class Window(QWidget):

    def __init__(self):
        super(Window, self).__init__()
        self.view = View(self)
        s = QShortcut(self)
        s.setKey(Qt.Key_Tab)
        s.activated.connect(self.tabKeyPressed)
        self.setupInspector()
        self.splitter = QSplitter(self)
        self.splitter.setOrientation(Qt.Vertical)
        layout = QVBoxLayout(self)
        layout.setMargin(0)
        layout.addWidget(self.splitter)
        self.splitter.addWidget(self.view)
        self.splitter.addWidget(self.webInspector)

    def tabKeyPressed(self):
        e = QKeyEvent(QEvent.KeyPress, Qt.Key_Tab, Qt.NoModifier)
        self.view.keyReleaseEvent(e)

    def setupInspector(self):
        page = self.view.page()
        page.settings().setAttribute(QWebSettings.DeveloperExtrasEnabled, True)
        self.webInspector = QWebInspector(self)
        self.webInspector.setPage(page)
        shortcut = QShortcut(self)
        shortcut.setKey(Qt.Key_F12)
        shortcut.activated.connect(self.toggleInspector)
        self.webInspector.setVisible(False)

    def toggleInspector(self):
        self.webInspector.setVisible(not self.webInspector.isVisible())

