<?php

class modxNotesItemEnableProcessor extends modObjectProcessor
{
    public $objectType = 'modxNotesItem';
    public $classKey = 'modxNotesItem';
    public $languageTopics = ['modxnotes'];
    //public $permission = 'save';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $id = $this->getProperty('id');
        if (empty($id)) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_ns'));
        }
        
        /** @var modxNotesItem $object */
        if (!$object = $this->modx->getObject($this->classKey, $id)) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_nf'));
        }

        $object->set('active', true);
        $object->save();

        return $this->success();
    }

}

return 'modxNotesItemEnableProcessor';
