# coding: utf-8
# Last Change: 2013 Nov 12, 16:05

from PyQt4.QtCore import *
from PyQt4.QtGui import *

from app import App


class FS(QObject):

    @pyqtSlot(result=QVariant)
    def test(self):
        return [
            ['ok', 'test']
        ]

    @pyqtSlot(QVariant)
    def some(self, callback):
        callback()

    @pyqtSlot(str, result=QStringList)
    def readdir(self, path):
        return [
            ['some', 'okay', 'test']
        ]

    def evalJS(self, code):
        App.view.page().mainFrame().evaluateJavaScript(code)
