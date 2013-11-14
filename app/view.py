# coding: utf-8
# Last Change: 2013 Nov 12, 13:09

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *


class View(QWebView):

    def __init__(self, parent=None):
        super(QWebView, self).__init__(parent)
        #self.mousePressEvent = lambda event: event.ignore()
        #self.keyDownEvent = lambda event: event.ignore()
