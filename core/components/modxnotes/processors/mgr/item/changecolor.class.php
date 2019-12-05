<?php

class modxNotesItemChangeColorProcessor extends modObjectProcessor
{
    public $objectType = 'modxNotesItem';
    public $classKey = 'modxNotesItem';
    public $languageTopics = ['modxnotes'];
    public $beforeSaveEvent = 'mnOnBeforeUpdateNote';
    public $afterSaveEvent = 'mnOnUpdateNote';
    //public $permission = 'save';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $color = $this->getProperty('color');
        $id = $this->getProperty('id');
        if (empty($id)) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_ns'));
        }
        
        /** @var modxNotesItem $object */
        if (!$object = $this->modx->getObject($this->classKey, $id)) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_nf'));
        }

        $this->modx->invokeEvent($this->beforeSaveEvent, array(
            'object' => $object,
        ));

        $object->set('color', $color);
        if ($object->save() == false) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_save'));
        }

        $this->modx->invokeEvent($this->afterSaveEvent, array(
            'object' => $object,
        ));

        return $this->success();
    }

}

return 'modxNotesItemChangeColorProcessor';
