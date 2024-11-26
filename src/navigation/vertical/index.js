// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import MenuIcon from 'mdi-material-ui/Menu';
import MessageOutline from 'mdi-material-ui/MessageOutline'

const navigation = () => {
  return [
   
    // {
    //   sectionTitle: 'Apps & Pages'
    // },
    {
      title: 'Blog',
      icon: HomeOutline,
      path: '/dashboards/blog'
    },
    {
      title: 'Menu',
      icon: MenuIcon,
      path: '/dashboards/menu'
    },
    {
      title: 'CMS',
      icon: MessageOutline,
      path: '/dashboards/cms'
    },
    {
      title: 'EnquiryForm',
      icon: MessageOutline,
      path: '/dashboards/viewDetails'
    },
   
  ]
}

export default navigation
