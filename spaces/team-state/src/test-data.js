({
  name: 'root',
  children1: [
    {
      name: 'child1',
      children: [
        {
          name: 'child1.1',
          children: [
            {
              name: 'child1.1.1',
              status: 'In Progress',
              completion: 0.2,
              prs: [
                { status: 'In Progress' },
                { status: 'In Review' },
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
              ]
            },
            {
              name: 'child1.1.2'
            },
            {
              name: 'child1.1.3'
            }
          ]
        }
      ]
    }
  ],
  children: [
    {
      name: 'child1',
      status: 'In Progress',
      children: [
        {
          name: 'child1.1',
          children: [
            {
              name: 'DMC-3908 (1.1.1) Item to implement next next next',
              assignee: 'John Doe'.repeat(4),
            },
            {
              name: 'child1.1.2',
              assignee: 'John Doe',
            }
          ]
        },
        {
          name: 'child1.2',
          status: 'In Progress',
          children: [
            {
              name: 'child1.2.1',
              status: 'In Progress',
              completion: 0.66,
              assignee: 'John Doe',
              prs: [
                { status: 'In Progress' },
                { status: 'In Review' },
                { status: 'Done' },
              ]
            }
          ]
        },
        {
          name: 'child1.3'
        }
      ]
    },
    {
      name: 'child2',
      children: [
        {
          name: 'child2.1',
          children: [
            {
              name: 'child2.1.1'
            },
            {
              name: 'child2.1.2'
            },
            {
              name: 'child2.1.3'
            },
            {
              name: 'child2.1.4'
            }
          ]
        }
      ]
    },
    {
      name: 'child3',
      children: [
        {
          name: 'child3.1',
          children: [
            {
              name: 'child3.1.1'
            },
            {
              name: 'child3.1.2'
            },
            {
              name: 'child3.1.3'
            }
          ]
        },
        {
          name: 'child3.2',
          status: 'In Progress',
          children: [
            {
              name: 'child3.2.1',
              status: 'In Progress',
              prs: [
                { status: 'In Progress' },
              ]
            }
          ]
        },
        {
          name: 'child3.3',
          status: 'Done',
          children: [
            {
              name: 'child3.3.1',
              status: 'Done',
              prs: [
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
                { status: 'Done' },
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'child4',
      children: [
        {
          name: 'child4.1',
          children: [
            {
              name: 'child4.1.1',
              prs: [
                { status: 'In Progress' },
                { status: 'In Progress' },
                { status: 'In Progress' },
                { status: 'In Progress' },
                { status: 'In Progress' },
                { status: 'In Progress' },
                { status: 'In Progress' },
                { status: 'In Progress' },
                { status: 'In Review' },
                { status: 'In Review' },
                { status: 'In Review' },
                { status: 'In Review' },
                { status: 'In Review' },
                { status: 'In Review' },
                { status: 'In Review' },
                { status: 'In Review' },
              ]
            },
            {
              name: 'child4.1.2'
            }
          ]
        }
      ]
    },
    {
      name: 'child5',
      children: [
        {
          name: 'child5.1',
          children: [
            {
              name: 'child5.1.1'
            }
          ]
        }
      ]
    },
    {
      name: 'child6',
      children: [
        {
          name: 'child6.1',
          children: [
            {
              name: 'child6.1.1'
            },
            {
              name: 'child6.1.2'
            },
            {
              name: 'child6.1.3'
            }
          ]
        },
        {
          name: 'child6.2',
          status: 'In Review',
          children: [
            {
              name: 'child6.2.1',
              status: 'In Review',
              assignee: 'Jane Doe',
            }
          ]
        }
      ]
    },
    {
      name: 'child7',
      children: [
        {
          name: 'child7.1',
          children: [
            {
              name: 'child7.1.1'
            },
            {
              name: 'child7.1.2'
            }
          ]
        }
      ]
    },
    {
      name: 'child8'
    }
  ]
})