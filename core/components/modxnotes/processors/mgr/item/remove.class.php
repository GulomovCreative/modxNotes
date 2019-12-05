<?php

class modxNotesItemRemoveProcessor extends modObjectProcessor
{
    public $objectType = 'modxNotesItem';
    public $classKey = 'modxNotesItem';
    public $languageTopics = ['modxnotes'];
    public $beforeRemoveEvent = 'mnOnBeforeRemoveNote';
    public $afterRemoveEvent = 'mnOnRemoveNote';
    //public $permission = 'remove';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $id = $this->modx->fromJSON($this->getProperty('id'));
        if (empty($id)) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_ns'));
        }

        /** @var modxNotesItem $object */
        if (!$object = $this->modx->getObject($this->classKey, $id)) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_nf'));
        }

        $this->modx->invokeEvent($this->beforeRemoveEvent, array(
            'object' => $object,
        ));

        if ($object->remove() == false) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_remove'));
        }

        $this->modx->invokeEvent($this->afterRemoveEvent, array(
            'object' => $object,
        ));

        return $this->success();
    }

}

return 'modxNotesItemRemoveProcessor';