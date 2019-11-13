<?php

/**
 * The home manager controller for modNotes.
 *
 */
class modNotesHomeManagerController extends modExtraManagerController
{
    /** @var modNotes $modNotes */
    public $modNotes;


    /**
     *
     */
    public function initialize()
    {
        $this->modNotes = $this->modx->getService('modNotes', 'modNotes', MODX_CORE_PATH . 'components/modnotes/model/');
        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return ['modnotes:default'];
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('modnotes');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->modNotes->config['cssUrl'] . 'mgr/main.css');

        $this->addHtml('<script type="text/javascript">
        var modNotes = {
            config: ' . json_encode($this->modNotes->config) . '
        }
        modNotes.config.http_modauth = "' . $this->modx->user->getUserToken($this->modx->context->get('key')) . '";
        Ext.onReady(function() {modNotes.init();});
        </script>');

        $this->addLastJavascript($this->modNotes->config['jsUrl'] . 'mgr/modnotes.events.js');
        $this->addLastJavascript($this->modNotes->config['jsUrl'] . 'mgr/modnotes.utils.js');
        $this->addLastJavascript($this->modNotes->config['jsUrl'] . 'mgr/modnotes.ajax.js');
        $this->addLastJavascript($this->modNotes->config['jsUrl'] . 'mgr/modnotes.js');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        $this->content .= '<div id="modnotes-panel-home-div"></div>';

        return '';
    }
}