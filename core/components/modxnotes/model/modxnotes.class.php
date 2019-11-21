<?php

class modxNotes
{
    /** @var modX $modx */
    public $modx;


    /**
     * @param modX $modx
     * @param array $config
     */
    function __construct(modX &$modx, array $config = [])
    {
        $this->modx =& $modx;
        $corePath = MODX_CORE_PATH . 'components/modxnotes/';
        $assetsUrl = MODX_ASSETS_URL . 'components/modxnotes/';

        $this->config = array_merge([
            'corePath' => $corePath,
            'modelPath' => $corePath . 'model/',
            'processorsPath' => $corePath . 'processors/',

            'connectorUrl' => $assetsUrl . 'connector.php',
            'assetsUrl' => $assetsUrl,
            'cssUrl' => $assetsUrl . 'css/',
            'jsUrl' => $assetsUrl . 'js/',
            'dateFormat' => $this->modx->getOption('modxnotes_date_format', [], '%d.%m.%Y %H:%M')
        ], $config);

        $this->modx->addPackage('modxnotes', $this->config['modelPath']);
        $this->modx->lexicon->load('modxnotes:default');
    }

}