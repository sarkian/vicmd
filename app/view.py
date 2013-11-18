# coding: utf-8
# Last Change: 2013 Nov 18, 22:23

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *


class View(QWebView):

    key_codes = {
        24:  81  , # q
        25:  87  , # w
        26:  69  , # e
        27:  82  , # r
        28:  84  , # t
        29:  89  , # y
        30:  85  , # u
        31:  73  , # i
        32:  79  , # o
        33:  80  , # p
        34:  91  , # [
        35:  93  , # ]
        51:  92  , # \
        38:  65  , # a
        39:  83  , # s
        40:  68  , # d
        41:  70  , # f
        42:  71  , # g
        43:  72  , # h
        44:  74  , # j
        45:  75  , # k
        46:  76  , # l
        47:  59  , # ;
        48:  39  , # '
        52:  90  , # z
        53:  88  , # x
        54:  67  , # c
        55:  86  , # v
        56:  66  , # b
        57:  78  , # n
        58:  77  , # m
        59:  44  , # ,
        60:  46  , # .
        61:  47    # /
    }

    def __init__(self, parent=None):
        super(QWebView, self).__init__(parent)

    def keyPressEvent(self, e):
        #print '%d %d' % (e.key(), e.nativeScanCode())
        if e.key() < 300:
            event = e
        else:
            if e.nativeScanCode() in self.key_codes:
                code = self.key_codes[e.nativeScanCode()]
            else:
                code = e.key()
            event = QKeyEvent(QEvent.KeyPress, code, e.modifiers())
        #print e.key()
        #QWebView.keyPressEvent(self, event)
        QWebView.keyReleaseEvent(self, event)
        #print ('%d:' % e.nativeScanCode()).ljust(5) + str(e.key()).ljust(4) + ', # ' + e.text()

