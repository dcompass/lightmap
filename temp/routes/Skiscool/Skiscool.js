/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes, Component } from 'react';
import Skiscool from '../../components/Skiscool';
const ShowArticles = (articles) => (
  <ul>
    {articles.map((article, i) =>
      <li key={i}>
        <a href={article.url}>{article.title}</a> by {article.author}
      </li>
    )}
  </ul>
);
class HomePage extends Component {
  static contextTypes = {
    setTitle: React.PropTypes.func.isRequired,
    setMeta: React.PropTypes.func.isRequired,
  };
  static propTypes = {
    articles: PropTypes.array,
    lang: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
  };
  
  componentDidMount() {
    window._q && window._q.whenDone(() => {
      // $ AND bootstrap are ready
      const $ = jQuery; // eslint-disable-line no-undef jsx-control-statements/jsx-jcs-no-undef
      const managetips = function () {
        //  $('[data-toggle="tooltip"]').tooltip();
        const detailSBU = $('.detailsbu');
        const detailSB = $('.detailsb');
        if (detailSBU) {
          detailSB.popover({ trigger: 'hover' });
          detailSBU.popover({
            trigger: 'manual',
            animation: true,
            html: true,
            placement: (pop) => {
              if (window.innerWidth <= 1050) {
                $(pop).css('position', 'relative');
                return 'bottom';
              }
              $(pop).css('position', 'absolute');
              return 'right';
            },
          });
          const sddul = detailSBU.closest('div');
          sddul.delegate('a.detailsbu',
            'click mousedown',
            function () {
              if (!$(this).hasClass('active')) {
                sddul.find('.active').removeClass('active').popover('hide');
                $(this).addClass('active');
                $(this).find('.mb3').removeClass('fa-question-circle-o')
                  .addClass('fa-question-circle');
                $(this).popover('show').delay(10);
              }
            }
          ).delegate('a.detailsbu',
            'mouseleave',
            function () {
              $(this).popover('hide');
            }).delegate('a.detailsbu',
            'mouseenter',
            function () {
              if ($(this).hasClass('active')) {
                $(this).popover('show');
              }
            });
          detailSB.popover({
            animation: true,
            html: false,
            trigger: 'manual',
            placement: (pop) => {
              if ($(window).width() <= 400) {
                $(pop).css('position', 'relative');
                return 'top';
              }
              return 'right';
            },
          }).mouseenter(function (e) {
            if (!$(this).hasClass('showpop') || $(this).hasClass('hidepop')) {
              $(this).removeClass('hidepop').addClass('showpop');
              $(this).popover('show');
              $(this).css('color', '#985DCC');
            } else {
              $(this).removeClass('showpop').addClass('hidepop');
              $(this).popover('hide');
              $(this).css('color', '#08c');
            }
            e.preventDefault();
          }).mouseout(function () {
            $(this).removeClass('showpop').addClass('hidepop');
            $(this).popover('hide');
            $(this).css('color', '#08c');
          }).hover(function () {
              $(this).css('cursor', 'pointer');
            },
            function () {
              $(this).css('cursor', 'auto');
            }
          );
        }
      };
      $(document).ready(managetips);
    });
  }
  
  render() {
    // eslint-disable-next-line no-unused-vars
    const { lang, articles, description, keywords, title } = this.props;
    this.context.setTitle(title);
    this.context.setMeta('description', description);
    if (keywords)
      this.context.setMeta('keywords', keywords);
    return (
      <div>
        <Skiscool
          lang={lang}
        />
        <If condition={articles}>
          <h2>Recent Articles</h2>
          <ShowArticles articles={articles}/>
        </If>
      </div>
    );
  }
}
export default HomePage;
