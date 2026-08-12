export interface School {
    id: string;
    name: string;
    description: string;
}

export const SCHOOLS: School[] = [
    {
        id: 'agric',
        name: 'School of Agriculture',
        description: 'Bridging the gap between theory and practice through sustainable farming techniques, agribusiness management, and hands-on laboratory work.'
    },
    {
        id: 'bus',
        name: 'School of Business',
        description: 'Developing strategic leaders and entrepreneurs equipped with management skills for a dynamic global economy.'
    },
    {
        id: 'edu',
        name: 'School of Education',
        description: 'Empowering the next generation of educators with cutting-edge instructional strategies, curriculum development, and pedagogical expertise.'
    },
];