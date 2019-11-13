<?php

return [
    'modNotes' => [
        'file' => 'modnotes',
        'description' => 'modNotes snippet to list notes',
        'properties' => [
            'tpl' => [
                'type' => 'textfield',
                'value' => 'tpl.modNotes.item',
            ],
            'sortby' => [
                'type' => 'textfield',
                'value' => 'rank',
            ],
            'sortdir' => [
                'type' => 'list',
                'options' => [
                    ['text' => 'ASC', 'value' => 'ASC'],
                    ['text' => 'DESC', 'value' => 'DESC'],
                ],
                'value' => 'ASC',
            ],
            'limit' => [
                'type' => 'numberfield',
                'value' => 10,
            ],
            'outputSeparator' => [
                'type' => 'textfield',
                'value' => "\n",
            ],
            'toPlaceholder' => [
                'type' => 'combo-boolean',
                'value' => false,
            ],
        ],
    ],
];