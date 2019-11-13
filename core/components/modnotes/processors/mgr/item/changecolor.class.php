<?php

class modNotesItemChangeColorProcessor extends modObjectProcessor
{
    public $objectType = 'modNotesItem';
    public $classKey = 'modNotesItem';
    public $languageTopics = ['modnotes'];
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
            return $this->failure($this->modx->lexicon('modnotes_item_err_ns'));
        }
        
        /** @var modNotesItem $object */
        if (!$object = $this->modx->getObject($this->classKey, $id)) {
            return $this->failure($this->modx->lexicon('modnotes_item_err_nf'));
        }

        $object->set('color', $color);
        $object->save();

        return $this->success();
    }

}

return 'modNotesItemChangeColorProcessor';
