var fs = require('fs');
var Handlebars = require('handlebars');
var gravatar = require('gravatar');
var _ = require('underscore');
var _s = require('underscore.string');
var moment = require('moment');

const SKILLS_LEVELS = [ 'Beginner', 'Intermediate', 'Advanced', 'Master' ];

const date_format = 'YYYY. MM. DD';
const date_year_month_format = 'YYYY. MM';

function isDateString(dateStr) {
    return moment(dateStr).isValid();
}

// Utity Methods ( need be moved to a separate file)

function hasEmail(resume) {
    return !!resume.basics && !! resume.basics.email;
}

function getNetwork(profiles, network_name) {
    return _.find(profiles, function(profile) {
        return profile.network.toLowerCase() === network_name;
    });
}

function humanizeDuration ( moment_obj, did_leave_company ) {
    var days,
        months = moment_obj.months(),
        years = moment_obj.years(),
        month_str = months > 1 ? 'months' : 'month',
        year_str = years > 1 ? 'years' : 'year';

    if ( months && years ) {
        return years + ' ' + year_str + ' ' + months + ' ' + month_str;
    }

    if ( months ) {
        return months + ' ' + month_str;
    }

    if ( years ) {
        return years + ' ' + year_str;
    }

    if ( did_leave_company ) {
        days = moment_obj.days();

        return ( days > 1 ? days + ' days' : days + ' day' );
    } else {
        return 'Recently joined';
    }
}

function getUrlFromUsername( site, username ) {
    var url_map = {
        github: 'github.com',
        twitter: 'twitter.com',
        soundcloud: 'soundcloud.com',
        pinterest: 'pinterest.com',
        vimeo: 'vimeo.com',
        behance: 'behance.net',
        codepen: 'codepen.io',
        foursquare: 'foursquare.com',
        reddit: 'reddit.com',
        spotify: 'spotify.com',
        dribble: 'dribbble.com',
        dribbble: 'dribbble.com',
        facebook: 'facebook.com',
        angellist: 'angel.co',
        bitbucket: 'bitbucket.org'
    };

    site = site.toLowerCase();

    if ( !username || !url_map[ site ] ) {
        return;
    }

    switch( site ) {
        case 'skype':
            return 'skype:' + username + '?call';
        case 'reddit':
        case 'spotify':
            return '//' + 'open.' + url_map[ site ] + '/user/' + username;
        default:
            return '//' + url_map[ site ] + '/' + username;
    }
 }

const convertMap = {
    "YYYY-MM-DD" : date_format,
    "YYYY-MM" : date_year_month_format
};

function convertDateStr(dateVal) {
    if (dateVal) {
        for (let dateFormatKey in convertMap) {
            if (moment(dateVal, dateFormatKey, true).isValid()) {
                return moment(dateVal).format(convertMap[dateFormatKey]);
            }
        }
    }
}



function convertSkill(skill_info) {
    if (skill_info.level) {
        let some = {
            skill_class: skill_info.level.toLowerCase(),
            level: _s.capitalize(skill_info.level.trim()),
            display_progress_bar: _.contains(SKILLS_LEVELS, skill_info.level)
        };

        return _.extend(skill_info, some);
    }
}

const SORT_MAP = {
    master: 1,
    advanced: 2,
    intermediate: 3,
    beginner: 4
};

function skillsSortFunc (skill) {
    let level = skill.level && skill.level.toLowerCase();
    return SORT_MAP[ level ];
}

function convertDatePorp(volunteer_info) {
    let dataObj = _.chain(['startDate', 'endDate'])
        .map((date) => [date, convertDateStr(volunteer_info[date])])
        .object()
        .value();

    return _.extend(volunteer_info, dataObj);
}

function covertSummary(resume) {
    const summaryArr = resume.basics.summary.split("\n");
    return _.reduce(summaryArr, (fullSummay, summary) => {
        return `${fullSummay}<p>${summary}</p>`;
    }, "");
}

function render(resume) {
    var css = fs.readFileSync(__dirname + '/assets/css/theme.css', 'utf-8'),
        template = fs.readFileSync(__dirname + '/resume.template', 'utf-8'),
        profiles = resume.basics.profiles,
        social_sites = ["github", "linkedin", "stackoverflow", "twitter",
                        "soundcloud", "pinterest", "vimeo", "behance",
                        "codepen", "foursquare", "reddit", "spotify",
                        "dribble", "dribbble", "facebook", "angellist",
                        "bitbucket", "skype"];

    // Basic
    if (!resume.basics.picture && hasEmail(resume)) {
        resume.basics.picture = gravatar.url(resume.basics.email.replace('(at)', '@'), {
            s: '100',
            r: 'pg',
            d: 'mm'
        });
    }

    resume.basics.summary = covertSummary(resume);

    if ( resume.languages ) {
        resume.basics.languages = _.pluck( resume.languages, 'language' ).join( ', ' );
    }

    // Work
    resume.work = _.map(resume.work, convertDatePorp);

    // Skill
    resume.skills = _.chain(resume.skills)
        .map(convertSkill)
        .filter((skillInfo) => skillInfo != null)
        .sortBy(skillsSortFunc)
        .value();

     // Education
    resume.education = _.map( resume.education, convertDatePorp);

    // Awart
    _.each( resume.awards, function( award_info ) {
        if ( award_info.date ) {
            award_info.date = moment( new Date( award_info.date ) ).format( date_format )
        }
    });

    // Publish
    _.each( resume.publications, function( publication_info ) {
        if ( publication_info.releaseDate ) {
            publication_info.releaseDate = moment( new Date( publication_info.releaseDate ) ).format( 'MMM DD, YYYY' )
        }
    });

    // Volunteer
    resume.volunteer = _.map( resume.volunteer, convertDatePorp);

    // SocialSite
    _.each( social_sites, function( site ) {
        var username,
            social_account = getNetwork( profiles, site );

        if ( social_account ) {
            username = social_account.username;
            resume.basics[ site + '_url' ] =
                getUrlFromUsername( site, username ) || social_account.url;
        }
    });

    Handlebars.registerHelper('toClassName', function(text) {
        return text.toLowerCase().replace(/ /, '-');
    })
    return Handlebars.compile(template)({
        css: css,
        resume: resume
    });
}

module.exports = {
    render: render
};
