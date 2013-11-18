# coding: utf-8
# Last Change: 2013 Nov 18, 20:01

import json

from PyQt4.QtCore import QVariant
from PyQt4.QtCore import QString

from app import App


class State:

    def __init__(self):
        self.data = {}

    def fromFile(self, fname):
        fp = open(fname, 'r')
        self.data = json.load(fp)
        fp.close()
        return self

    def fromJSON(self, _state):
        self.data = json.loads(_state)
        return self

    def fromQVariant(self, _state):
        state = _state.toPyObject()
        panes = state[QString(u'panes')]
        self.data['panes'] = {
            'left': self._convertPane(panes[QString(u'left')]),
            'right': self._convertPane(panes[QString(u'right')]),
            'current': str(panes[QString(u'current')]),
        }
        return self

    def save(self, fname):
        f = open(fname, 'w+')
        json.dump(self.data, f, indent=4)
        f.close()

    def load(self):
        self._loadPane('left')
        self._loadPane('right')
        App.backend.evalJS(u'ui.panes.select("%s")' % self.data['panes']['current'])

    def _convertPane(self, _pane):
        tabs = []
        _tabs = _pane[QString(u'tabs')]
        for tab in _tabs:
            hist = tab[QString(u'history')] or {}
            history = {}
            for path in hist:
                history[unicode(path).encode('utf-8')] = unicode(hist[path]).encode('utf-8')
            tabs.append({
                'path': unicode(tab[QString(u'path')]).encode('utf-8'),
                'show_hidden': tab[QString(u'show_hidden')],
                'history': history,
                'selected': unicode(tab[QString(u'selected')])
            })
        return {
            'tabs': tabs,
            'current_tab': int(_pane[QString(u'current_tab')])
        }

    def _loadPane(self, _pane):
        pane = self.data['panes'][_pane]
        for tab in pane['tabs']:
            App.backend.evalJS(u'ui.panes.%s.tabs.open("%s")' % (_pane, tab['path']))
            for path in tab['history']:
                App.backend.evalJS(u'ui.panes.%s.tabs.last().historyAdd("%s", "%s")'
                        % (_pane, path, tab['history'][path]))
            App.backend.evalJS(u'ui.panes.%s.tabs.last().files.selectByName("%s")'
                    % (_pane, tab['selected']))
        App.backend.evalJS(u'ui.panes.%s.tabs.select(%s)' % (_pane, pane['current_tab']))
