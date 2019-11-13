<?php

class modNotesItemCreateProcessor extends modObjectCreateProcessor
{
    public $objectType = 'modNotesItem';
    public $classKey = 'modNotesItem';
    public $languageTopics = ['modnotes'];
    //public $permission = 'create';


    /**
     * @return bool
     */
    public function beforeSet()
    {
        $name = trim($this->getProperty('name'));
        if (empty($name)) {
            $this->modx->error->addField('name', $this->modx->lexicon('modnotes_item_err_name'));
        } elseif ($this->modx->getCount($this->classKey, ['name' => $name])) {
            $this->modx->error->addField('name', $this->modx->lexicon('modnotes_item_err_ae'));
        }

        return parent::beforeSet();
    }

    /**
     * @return bool
     */
    public function beforeSave()
    {
        $c = $this->modx->newQuery($this->classKey);
        $c->limit(1);
        $c->sortby('rank', 'DESC');
        $lastNote = $this->modx->getObject($this->classKey, $c);

        if ($lastNote) {
            $this->object->set('rank', $lastNote->get('rank')+1);
        }

        return parent::beforeSave();
    }

}

return 'modNotesItemCreateProcessor';